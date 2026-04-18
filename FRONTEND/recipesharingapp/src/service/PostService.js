import axios from "axios";

export const uploadPostImage = (image, recipeId) => {
  let formData = new FormData();
  formData.append("image", image);

  return axios
    .post(`http://localhost:8080/recipes//upload-image/${recipeId}`, formData,{
        headers:{
            'Content-Type':'multipart/form-data'
        }
    })
    .then((response) => response.data);
};
