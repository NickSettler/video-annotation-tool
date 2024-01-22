# Video Annotation Tool

This easy-to-use tool allows you to quickly and accurately annotate your videos for machine learning purposes.
With its interface and annotation features, you can identify and label objects, people, and activities in your videos.

## Key features

* **Simple path tool:** Draw polygons around objects and entities in your videos.
* **Timeline display:** View annotations in the timeline below the video block for easy navigation and editing.
* **Grouped annotations:** Organize your annotations into groups for more efficient management.

## Applications

* **Object detection:** Train machine learning models to identify and recognize objects in videos.
* **Activity recognition:** Develop models that can understand the actions and events happening in videos.
* **Video summarization:** Create concise summaries of long videos by detecting and summarizing key events.

## Get started

1. Upload your video to the tool.
2. Use the path tool to draw polygons around objects and entities in your videos.
3. Group your annotations into meaningful categories.
4. Export your annotations in a format that can be used by machine learning models.

# Build

The app uses a Dockerfile to build a production image for deploying the app.
The Dockerfile follows a multi-stage build approach, which involves building the React app in one stage and copying the
built files to a Nginx image in the second stage.
This reduces the size of the final image and improves performance.

**To build the image:**

```bash
docker build -t video-annotation-tool .
```

This will create a Docker image named video-annotation-tool that contains the built React app and Nginx configuration.

**To run the image:**

```bash
docker run -p 8080:80 video-annotation-tool
```

This will start the Nginx container and map port 8080 on the host machine to port 80 inside the container.
You can then access the app at http://localhost:8080.

# Development

To install and run the video annotation tool, you will need to have Node.js and Yarn installed on your system.
Once you have installed these dependencies, you can follow these steps:

1. Navigate to the project directory: `cd video-annotation-tool`
2. Install the dependencies: `yarn install`
3. Start the development server: `yarn start`

## Environmental Variables

The project uses an .env file to set environmental variables for both development and production.
The .env file is ignored by git, so you need yo copy the .env.template file, rename it to .env and set the variables.
