import React,{useEffect, useState} from "react";
import {Card} from "react-bootstrap";
import axios from "axios";
import Navigation from "./Navigation";
import { useNavigate, Navigate } from "react-router-dom";
import cryptojs from 'crypto-js';
import '../App.css';

const API_KEY = 'e0ef8de9236a4c608dcdadbc7f2c3b2c';
const url = 'https://newsapi.org/v2/top-headlines?country=us&apiKey='+API_KEY;
const News = (props) => {
    let newsList = null;
    console.log(url);
    const [news , setNews] = useState(undefined);
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
           
                }
                else{
                    
                    let bytes1 = cryptojs.AES.decrypt(data._id, 'MySecretKey');
                    console.log(bytes1);
                    let tempid = JSON.parse(bytes1.toString(cryptojs.enc.Utf8));
                    
                    let id = localStorage.getItem("userSession");
                    let bytes = cryptojs.AES.decrypt(id, 'MySecretKey');
                    console.log(bytes);

                   let decid = JSON.parse(bytes.toString(cryptojs.enc.Utf8)); 
                   
                   
                   if(tempid === decid.toString()){
                    
                    console.log("here");
                       console.log("works");
                       setSession(true);
                   }
                   else{
                    setSession(false);
                   }
                }
            }
            catch(e){
                console.log(e);
            }
        }

        async function fetchData(){
            const { data } = await axios.get(url);
            setNews(data);
            setLoading(false);
            console.log(data);
        }
        if(localStorage.length !== 0){
            checkSession();
            if(session){
                fetchData();
            }
        }
        else{
            setSession(false);
        }
    },[]);

    newsList = news && news.articles.map((n) => {
        return <Card key={n.title} className="card news-card" >
         
            <Card.Body className="card-body">
            <a className="card-link" href={n.url} target="_blank">
                <Card.Img className="card-img  pb-3" variant="top" 
                src={n.urlToImage} alt="News Image" />
                <Card.Title className="card-title">{n.title}</Card.Title></a>
                <Card.Text className="p">
                    {n.content}
                </Card.Text>
            </Card.Body>
        </Card>
        
    })

    if(!session){
        //alert("You should login first");
        return (
        <Navigate to="/" replace />
        );
    }

    if(loading){
        return(
        <div>
            <Navigation></Navigation>
            <h1>Loading...</h1>
        </div>
        );
    }
    else{
    return(
        <div>
            <Navigation></Navigation>  
            
        <div className="cards">
            
            {newsList}
        </div>

              
        </div>
    );
    }

}

export default News;