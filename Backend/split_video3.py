import cv2
import json
import time
import os
import requests

from upload_to_bucket import upload_file_to_gcs
from google.cloud import pubsub_v1

project_id = "god-eyes-444201"
topic_id = "frames"
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "god-eyes-444201-7a0a8e69bd01.json"

# Create a Publisher client
publisher = pubsub_v1.PublisherClient()

# Build the topic path
topic_path = publisher.topic_path(project_id, topic_id)
subscriber = pubsub_v1.SubscriberClient()

# Replace with your subscription name
subscription_path = subscriber.subscription_path(project_id, 'frames-sub')

def post_frames(key):
    bucket_name = 'camera-frames'

    # Aqui reemplazan por su URL de su camara
    stream_url = "http://192.168.1.34:8080/video"

    cap = cv2.VideoCapture(stream_url)

    if not cap.isOpened():
        print("Error: Could not open video stream.")
        exit()

    try:
        while True:
            time.sleep(5)

            for _ in range(int(cap.get(cv2.CAP_PROP_FPS))):
                cap.grab()

            ret, frame = cap.read()
            if not ret:
                print("Error: Could not read frame.")
                break

            success, encoded_image = cv2.imencode('.jpg', frame)
            if not success:
                print("Error: Could not encode frame.")
                continue
            
            image_data = encoded_image.tobytes()
            
            timestamp = time.strftime("%Y%m%d_%H%M%S")
            
            print(f"Captured frame at {timestamp}")


            public_file_url = upload_file_to_gcs(bucket_name, image_data, f"frames/{key}-{timestamp}.jpg")
            payload = {
                "name": key,
                "url": public_file_url,
                "timestamp": timestamp,
            }
            url = "http://34.28.167.34/predict"
            response = requests.post(url, json=payload)

            response_data = response.json()
            json_string = json.dumps(response_data)


            data = json_string.encode("utf-8")
            future = publisher.publish(topic_path, data)
            print(f"Published message ID: {future.result()}")

    except KeyboardInterrupt:
        print("Exiting...")

    finally:
        cap.release()
        


if __name__ == "__main__":
    # Reemplazan por el nombre asignado
    post_frames("video1")