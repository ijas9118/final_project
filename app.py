from ultralytics import YOLO
from ultralytics.solutions import object_counter
from ultralytics.solutions import heatmap
from flask_cors import CORS
import threading
import cv2
from flask import Flask, json, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
CORS(app)

model = YOLO('./backend/YOLOv8/runs/detect/train/weights/best.pt')
model2 = YOLO('yolov8n.pt')

app.config['UPLOAD_FOLDER'] = './'

OUTPUT_VIDEO_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'output_videos')

os.makedirs(OUTPUT_VIDEO_DIR, exist_ok=True)

data = {}

@app.route('/output_videos/<path:filename>', methods=['GET'])
def serve_output_video(filename):
    return send_from_directory(OUTPUT_VIDEO_DIR, filename)

@app.route('/count_line', methods=['POST'])
def upload_file_count_line():
    # Get the file from the request
    file = request.files['file']
    selected_classes = json.loads(request.form['selectedClasses'])
    confidence = float(request.form.get('confidence'))

    # Check if the file is present
    if file:
        # Get the filename and save it securely
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        # Save the file
        file.save(file_path)

        # Process the video file using YOLOv8 with selected class IDs
        count_data = count_line(file_path, selected_classes, confidence)
        print(count_data)
        os.remove(file_path)

        return jsonify({'message': 'Video uploaded and processed successfully', 'count_data': count_data, 'output_filename': "count_line_output.mp4"}), 200
    else:
        return jsonify({'error': 'No file uploaded'}), 400
    
@app.route('/count_region', methods=['POST'])
def upload_file_count_polygon():
    file = request.files['file']
    selected_classes = json.loads(request.form['selectedClasses'])
    confidence = float(request.form.get('confidence'))

    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        file.save(file_path)

        count_data = count_region(file_path, selected_classes, confidence)
        print(count_data)
        os.remove(file_path)

        return jsonify({'message': 'Video uploaded and processed successfully', 'count_data': count_data, 'output_filename': "count_region_output.mp4"}), 200
    else:
        return jsonify({'error': 'No file uploaded'}), 400
    
@app.route('/heatmap', methods=['POST', 'GET'])
def upload_file_heatmap():
    file = request.files['file']
    selected_classes = json.loads(request.form['selectedClasses'])
    confidence = float(request.form.get('confidence'))

    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        file.save(file_path)

        heatMap(file_path, selected_classes, confidence)
        os.remove(file_path)

        return jsonify({'message': 'Video uploaded and processed successfully', 'output_filename': "heatmap_output.mp4"}), 200
    else:
        return jsonify({'error': 'No file uploaded'}), 400

@app.route('/multivideo', methods=['POST'])
def handle_multivideo():
    # Get the form data
    form_data = request.form

    # Check if video files are present
    if 'file1' not in request.files and 'file2' not in request.files:
        return {'message': 'No video files provided'}, 400

    # Get video files
    video1 = request.files.get('file1', None)
    video2 = request.files.get('file2', None)

    filename = secure_filename(video1.filename)
    file_path1 = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    video1.save(file_path1)

    filename = secure_filename(video2.filename)
    file_path2 = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    video2.save(file_path2)

    # Get confidence thresholds
    confidence1 = float(form_data.get('confidence1', 0.3))
    confidence2 = float(form_data.get('confidence2', 0.3))

    # Process the videos and get count data
    tracker_thread1 = threading.Thread(target=run_tracker_in_thread, args=(file_path1, model, 1, confidence1), daemon=True)
    tracker_thread2 = threading.Thread(target=run_tracker_in_thread, args=(file_path2, model2, 2, confidence2), daemon=True)

    # Start the tracker threads
    tracker_thread1.start()
    tracker_thread2.start()

    # Wait for the tracker threads to finish
    tracker_thread1.join()
    tracker_thread2.join()

    # Clean up and close windows
    cv2.destroyAllWindows()

    print(data)

    # Return the count data
    return {'message': 'Videos processed successfully', 'count_data1': data.get(1, {}), 'count_data2': data.get(2, {})}


def run_tracker_in_thread(filename, model, file_index, confidence_threshold):
        video = cv2.VideoCapture(filename)  # Read the video file
        assert video.isOpened(), "Error reading video file"

        count_data = {
            'car': {'in': 0, 'out': 0},
            'bus': {'in': 0, 'out': 0},
            'truck': {'in': 0, 'out': 0},
            'ambulance': {'in': 0, 'out': 0}
        }

        while True:
            ret, frame = video.read()

            # Exit the loop if no more frames in the video
            if not ret:
                break

            # Track objects in frames if available
            results = model.track(frame, persist=True, conf=confidence_threshold)
            res_plotted = results[0].plot()

            # Update count data
            for result in results[0].boxes.data.tolist():
                class_id = int(result[6])
                if class_id == 0:  # car
                    # Update count based on direction
                    count_data['car']['in' if result[4] > 0 else 'out'] += 1
                elif class_id == 1:  # bus
                    count_data['bus']['in' if result[4] > 0 else 'out'] += 1
                elif class_id == 2:  # truck
                    count_data['truck']['in' if result[4] > 0 else 'out'] += 1
                elif class_id == 3:  # ambulance
                    count_data['ambulance']['in' if result[4] > 0 else 'out'] += 1

            cv2.imshow(f"Tracking_Stream_{file_index}", res_plotted)
            key = cv2.waitKey(1)
            if key == ord('q'):
                break
        # Release video sources
        video.release()

        data[file_index] = count_data


def count_line(filepath, selected_classes, confidence):
    cap = cv2.VideoCapture(filepath)
    assert cap.isOpened(), "Error reading video file"
    assert cap.isOpened(), "Error reading video file"
    w, h, fps = (int(cap.get(x)) for x in (cv2.CAP_PROP_FRAME_WIDTH, cv2.CAP_PROP_FRAME_HEIGHT, cv2.CAP_PROP_FPS))

    video_writer = cv2.VideoWriter("./output_videos/count_line_output.mp4",
                               cv2.VideoWriter_fourcc(*'H264'),
                               fps,
                               (w, h))

    line_points = [(20, 400), (1080, 400)]
    classes_to_count = [int(class_id) for class_id in selected_classes]  # Convert selected class IDs to integers
    print(classes_to_count)
    counter = object_counter.ObjectCounter()
    counter.set_args(view_img=True, reg_pts=line_points, classes_names=model.names, draw_tracks=True, line_thickness=2)

    while cap.isOpened():
        success, im0 = cap.read()
        if not success:
            print("Video frame is empty or video processing has been successfully completed.")
            break

        tracks = model.track(im0, persist=True, show=False, classes=classes_to_count, conf=confidence)
        im0 = counter.start_counting(im0, tracks)
        video_writer.write(im0)

    cap.release()
    video_writer.release()
    cv2.destroyAllWindows()

    count_data = counter.class_wise_count
    return count_data


def count_region(filepath, selected_classes, confidence):
    cap = cv2.VideoCapture(filepath)
    assert cap.isOpened(), "Error reading video file"
    w, h, fps = (int(cap.get(x)) for x in (cv2.CAP_PROP_FRAME_WIDTH, cv2.CAP_PROP_FRAME_HEIGHT, cv2.CAP_PROP_FPS))

    video_writer = cv2.VideoWriter("./output_videos/count_region_output.mp4",
                               cv2.VideoWriter_fourcc(*'H264'),
                               fps,
                               (w, h))

    region_points = [(20, 400), (540, 404), (540, 360), (20, 360)]
    classes_to_count = [int(class_id) for class_id in selected_classes]  # Convert selected class IDs to integers
    print(classes_to_count)
    counter = object_counter.ObjectCounter()
    counter.set_args(view_img=True, reg_pts=region_points, classes_names=model.names, draw_tracks=True, line_thickness=2)

    while cap.isOpened():
        success, im0 = cap.read()
        if not success:
            print("Video frame is empty or video processing has been successfully completed.")
            break

        tracks = model.track(im0, persist=True, show=False, classes=classes_to_count, conf=confidence)
        im0 = counter.start_counting(im0, tracks)
        video_writer.write(im0)

    cap.release()
    video_writer.release()
    cv2.destroyAllWindows()

    count_data = counter.class_wise_count
    return count_data


def heatMap(filepath, selected_classes, confidence):
    cap = cv2.VideoCapture(filepath)
    assert cap.isOpened(), "Error reading video file"
    w, h, fps = (int(cap.get(x)) for x in (cv2.CAP_PROP_FRAME_WIDTH, cv2.CAP_PROP_FRAME_HEIGHT, cv2.CAP_PROP_FPS))

    video_writer = cv2.VideoWriter("./output_videos/heatmap_output.mp4",
                               cv2.VideoWriter_fourcc(*'H264'),
                               fps,
                               (w, h))

    # region_points = [(20, 400), (1080, 404), (1080, 360), (20, 360)]
    classes_to_count = [int(class_id) for class_id in selected_classes]
    print(classes_to_count)
    heatmap_obj = heatmap.Heatmap()
    heatmap_obj.set_args(colormap=cv2.COLORMAP_PARULA,
                        imw=w,
                        imh=h,
                        view_img=True,
                        shape="circle",
                        # count_reg_pts=region_points,
                        classes_names=model.names)

    while cap.isOpened():
        success, im0 = cap.read()
        if not success:
            print("Video frame is empty or video processing has been successfully completed.")
            break

        tracks = model.track(im0, persist=True, show=False, classes=classes_to_count, conf=confidence)
        im0 = heatmap_obj.generate_heatmap(im0, tracks)
        video_writer.write(im0)


    cap.release()
    video_writer.release()
    cv2.destroyAllWindows()

# def run_tracker_in_thread(filename, model, file_index, selected_classes, confidence_threshold, result_queue):
#     if isinstance(filename, str):
#         # filename is a string, pass it directly to VideoCapture
#         video = cv2.VideoCapture(filename)
#     else:
#         # filename is not a string, assume it's a file object
#         with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_file:
#             temp_file.write(filename.read())
#             temp_file_path = temp_file.name
#         video = cv2.VideoCapture(temp_file_path)

#     count_data = {
#         'car': {'in': 0, 'out': 0},
#         'bus': {'in': 0, 'out': 0},
#         'truck': {'in': 0, 'out': 0},
#         'ambulance': {'in': 0, 'out': 0}
#     }

#     while True:
#         ret, frame = video.read()

#         # Exit the loop if no more frames in the video
#         if not ret:
#             break

#         # Track objects in frames if available
#         results = model.track(frame, persist=True, classes=selected_classes, conf=confidence_threshold)
#         res_plotted = results[0].plot()

#         # Update count data
#         for result in results[0].boxes.data.tolist():
#             class_id = int(result[6])
#             if class_id == 0:  # car
#                 # Update count based on direction
#                 count_data['car']['in' if result[4] > 0 else 'out'] += 1
#             elif class_id == 1:  # bus
#                 count_data['bus']['in' if result[4] > 0 else 'out'] += 1
#             elif class_id == 2:  # truck
#                 count_data['truck']['in' if result[4] > 0 else 'out'] += 1
#             elif class_id == 3:  # ambulance
#                 count_data['ambulance']['in' if result[4] > 0 else 'out'] += 1

#         cv2.imshow(f"Tracking_Stream_{file_index}", res_plotted)
#         key = cv2.waitKey(1)
#         if key == ord('q'):
#             break

#     # Release video source
#     video.release()
#     temp_file.close()

#     # Put the count data in the queue for the main thread to retrieve
#     result_queue.put(count_data)

# def process_video(video, selected_classes, confidence_threshold):

#     # Create a queue to pass the result from the thread
#     result_queue = queue.Queue()

#     # Run the tracker in a separate thread
#     tracker_thread = threading.Thread(target=run_tracker_in_thread, args=(video, model, 1, selected_classes, confidence_threshold, result_queue), daemon=True)
#     tracker_thread.start()
#     tracker_thread.join()

#     # Get the count data from the queue
#     count_data = result_queue.get()

#     # Clean up and close windows
#     cv2.destroyAllWindows()

#     return count_data


if __name__ == '__main__':
    app.run()
