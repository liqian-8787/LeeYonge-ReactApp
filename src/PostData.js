import React from 'react';

class PostData extends React.Component {

    render(type,userData) {
        const BaseUrl = 'https://leeyongeapi.herokuapp.com/api/users/';
        return new Promise((resolve, reject) => {
            fetch(BaseUrl+type, {
                method: 'POST',
                body: JSON.stringify(userData)
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    resolve(responseJson);
                })
                .catch((error) => {
                    reject(error);
                })
                console.log(userData);
        })
    }
}
export default PostData;