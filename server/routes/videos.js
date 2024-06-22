const express = require("express");
const router = express.Router();
const axios = require('axios');


router.get("/", async (req,res) =>{
    try{
        const API_KEY = '8ba9f2869104be5276db0f1bf239ff58cb7ab9a271de9350b4e3e7ac2feb3d03';
        const url = 'https://serpapi.com/search.json?engine=youtube&search_query=top+videos&gl=us&hl=en&api_key='+API_KEY;
        const { data } = await axios.get(url);
    
        res.status(200).json(data);
    }catch(e){
        res.status(400).json({ error: e });
    }
})

module.exports = router;