import axios from "axios";

const USER_SERVICE_BASE_URL = "http://localhost:8080/users";

const USER_ID = "27c3eb93-b956-4a14-b9e6-146563440141";

class UserService{

    getUser(){
        return axios.get(USER_SERVICE_BASE_URL + '/' + USER_ID);
    }
}

export default new UserService;