import axios from "axios";

const baseURL = axios.create({

  baseURL: "http://10.21.55.109:8080/",

});

export default baseURL;
