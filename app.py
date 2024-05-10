from ultralytics import YOLO
from ultralytics.solutions import object_counter
from flask_cors import CORS
import cv2
from flask import Flask, json, request, jsonify
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
CORS(app)

model = YOLO('./backend/YOLOv8/runs/detect/train/weights/best.pt')

app.config['UPLOAD_FOLDER'] = './'


@app.route('/count_line', methods=['POST'])
def upload_file():
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

        return jsonify({'message': 'Video uploaded and processed successfully', 'count_data': count_data}), 200
    else:
        return jsonify({'error': 'No file uploaded'}), 400

def count_line(filepath, selected_classes, confidence):
    cap = cv2.VideoCapture(filepath)
    assert cap.isOpened(), "Error reading video file"

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

    cap.release()
    cv2.destroyAllWindows()

    count_data = counter.class_wise_count
    return count_data

if __name__ == '__main__':
    app.run()
