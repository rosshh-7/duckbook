import React,{useEffect, useState} from "react";
import {Card} from "react-bootstrap";
import axios from "axios";
import Navigation from "./Navigation";
import { useNavigate, Navigate } from "react-router-dom";
import cryptojs from 'crypto-js';
import '../App.css';

//const API_KEY = '8ba9f2869104be5276db0f1bf239ff58cb7ab9a271de9350b4e3e7ac2feb3d03';
const url = 'http://localhost:3000/videos';

const Videos = (props) => {
 
    let videoList = null;
    const [videos, setVideos] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [session , setSession] = useState(true);
    useEffect(() => {
        async function checkSession(){
            try{
                const instance = axios.create({
                    baseURL: '*',
                    timeout: 20000,
                  withCredentials: true,
                  headers: {
                      'Content-Type': 'application/json;charset=UTF-8',
                      "Access-Control-Allow-Origin": "*",
                    },
                  validateStatus: function (status) {
                      return status < 500; // Resolve only if the status code is less than 500
                    }
                });
  
                const { data } = await instance.get(`http://localhost:3000/session`);
                console.log(data);
                if('error' in data){
                    setSession(false);
                    //setLoading(true);
                    //return;
                }
                else{
                    
                    let bytes1 = cryptojs.AES.decrypt(data._id, 'MySecretKey');
                    console.log(bytes1);
                    let tempid = JSON.parse(bytes1.toString(cryptojs.enc.Utf8));
                    
                    let id = localStorage.getItem("userSession");
                    let bytes = cryptojs.AES.decrypt(id, 'MySecretKey');
                    console.log(bytes);
                   // let decid = JSON.parse(temp);
                   let decid = JSON.parse(bytes.toString(cryptojs.enc.Utf8)); 
                   
                   
                   if(tempid === decid.toString()){
                    
                    console.log("here");
                       console.log("works");
                       setSession(true);
                        //setLoading(false);
                   }
                   else{
                    setSession(false);
                    //setLoading(false); 
                   }
                }
            }
            catch(e){
                console.log(e);
            }
        }

        async function fetchData(){
            try{
                console.log("here");
               // axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
               console.log(url);
                const { data } = await axios.get(url);
                //const  data  = await fetch(url,{mode:'cors'});
                if(data){
                    
                    setVideos(data.video_results);
                    setLoading(false);
                }
                console.log(data)
            }
            catch(e){
                console.log(e);
            }
        }
        if(localStorage.length !== 0){
            checkSession();
            if(session){
                fetchData();
            }
        }
        else{
            setSession(false);
            setLoading(false);
        }
    },[]);

    videoList = videos && videos.map((v) => {
        let vidLink = v.link.split('=');
        let link = 'https://www.youtube.com/embed/'+vidLink[vidLink.length-1];
        return <Card key={v.position_on_page} className="card news-card vid-card" >
         
        <Card.Body className="card-body"> 
        <iframe width="420" height="315"
        src={link} frameBorder="0" allowFullScreen>
        </iframe>
        </Card.Body>
        </Card>
    });

    if(loading){
        return (
            <div>
            <Navigation></Navigation>
            <span>Loading.....</span>
            </div>
            );
    }
    if(!session){
        //alert("You should login first");
        return (
        <Navigate to="/" replace />
        );
    }

    return(
        <div>
            <Navigation></Navigation>
            <h1>Videos</h1>

          
                {videoList}
         
        </div>
    );
}

export default Videos;