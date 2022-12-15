'use strict';

require('dotenv').config();

const axios = require('axios').default;

const express = require('express')
const app = express()
const port = 3000
app.set('view engine', 'ejs');

const bodyParser = require('body-parser');

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");

app.use(express.static('public'));
app.use(bodyParser.json());     
app.use(bodyParser.urlencoded({     
    extended: true
}));

const options = {
    swaggerDefinition: {
      info: {
        title: "Face API",
        version: "1.0",
        description: "UI for face detection and analysis of an image",
      },
      host: "localhost:3000",
      basePath: "/",
    },
    apis: ["./app.js"],
  };

const specs = swaggerJsdoc(options);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());

/**
 * @swagger
 * /detectFaces:
 *    get:
 *      description: get the pixel values for detected faces in an image
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: url
 *            in: query
 *            type: string
 *            example: https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/faces.jpg  
 *      responses:
 *          200:
 *              description: Successfully retrieved faces pixel
 *          400:
 *              description: Bad request 
 * 
 */

app.get("/detectFaces",async(req, res) =>{
    let subscriptionKeyForFaceAPI = process.env.subscriptionKeyForFaceAPI
    let endpointForFaceAPI = process.env.endpointForFaceAPI
    let imageUrl=req.query.url;
    console.log(imageUrl);
    if(imageUrl.match(/\.(jpeg|jpg|png|bmp)$/) != null){
        axios({
            method: 'post',
            url: endpointForFaceAPI,
            params : {
                detectionModel: 'detection_03',
                returnFaceId: true
            },
            data: {
                url: imageUrl,
            },
            headers: { 'Ocp-Apim-Subscription-Key': subscriptionKeyForFaceAPI }
        }).then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type','Application/json');
            if(response.data.length>0){
                res.send(response.data);
            }
            else{
                res.send("No faces detected");
            }
            
        }).catch(function (error) {
            res.statusCode = 400;
            res.setHeader('Content-Type','Application/json');
            res.send(error);
        });
    }
    else{
        res.statusCode = 400;
        res.setHeader('Content-Type','Application/json');
        res.send("Invalid image format");
    }
        
      
});

/**
 * @swagger
 * /analyzeImage:
 *    get:
 *      description: get the analysis of an image
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: url
 *            in: query
 *            type: string
 *            example: https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/faces.jpg  
 *      responses:
 *          200:
 *              description: Successfull
 *          400:
 *              description: Bad request 
 * 
 */

//endpoint for CV API to get analysis of an image

app.get("/analyzeImage",async(req, res) =>{
    let subscriptionKeyForCVAPI = process.env.subscriptionKeyForCVAPI
    let endpointForCV = process.env.endpointForCV
    let imageUrl=req.query.url;
    console.log(imageUrl);
    if(imageUrl.match(/\.(jpeg|jpg|gif|png|bmp)$/) != null){
        axios({
            method: 'post',
            url: endpointForCV,
            params : {
                detectionModel: 'detection_03',
                returnFaceId: true
            },
            data: {
                url: imageUrl,
            },
            headers: { 'Ocp-Apim-Subscription-Key': subscriptionKeyForCVAPI }
        }).then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type','Application/json');
            res.send(response.data);
        }).catch(function (error) {
            res.statusCode = 400;
            res.setHeader('Content-Type','Application/json');
            res.send(error);
        }); 

    }
    else{
        res.statusCode = 400;
        res.setHeader('Content-Type','Application/json');
        res.send("Invalid image format");
    }
          
});






app.listen(port, () => {

  console.log(`Example app listening at localhost:${port}`);
  });
  