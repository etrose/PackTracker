import React from 'react';
import firebase from "firebase";
import 'firebase/firestore';

export default class Friends extends React.Component {
    constructor(curr_id, curr_username) {
        super();
        this.state = { 
            curr_id,
            curr_username,
        };
    }

    async addFriend(otherUsername, otherUserId){
        firebase.database().ref('users/'+otherUserId+'/friends/'+this.state.curr_id).set({
            username: this.state.curr_username,
            sent: false,
        }).then(()=> {
            firebase.database().ref('users/'+this.state.curr_id+'/friends/'+otherUserId).set({
                username: otherUsername,
                sent: true,
            });
        }).catch(error => {
            const { code, message } = error;
            alert(message);
        });
    }

    async acceptRequest(otherUsername, otherUserId){
        currUserId = this.state.curr_id;
        currUsername = this.state.curr_username;
        firebase.database().ref('users/'+otherUserId+'/friends/'+currUserId).set({
            username: currUsername,
            sent: null,
        }).then(()=> {
            firebase.database().ref('users/'+currUserId+'/friends/'+otherUserId).set({
                username: otherUsername,
                sent: null,
            });
        }).catch(error => {
            const { code, message } = error;
            alert(message);
        });
        //this.cancelRequest(currUserId, currUsername, otherUserId, otherUsername);
    }
    
    async deleteFriend(otherUserId) {
        firebase.database().ref('users/'+otherUserId+'/friends/'+this.state.curr_id).remove().then(()=> {
            firebase.database().ref('users/'+this.state.curr_id+'/friends/'+otherUserId).remove();
        }).catch(error => {
            const { code, message } = error;
            alert(message);
        });
    }

    async sendMessage(otherUserId, message) {
        var dt = new Date();
        var serialized = JSON.stringify(new Date());


        firebase.firestore().collection('users/'+otherUserId+'/messages').add({
            message,
            id: this.state.curr_id,
            username: this.state.curr_username,
            timestamp: serialized
        }).catch(error => {
            const { code, message } = error;
            alert(message);
        });
    }

    async deleteMessage(messageId) {
        firebase.firestore().doc('users/'+this.state.curr_id+'/messages/'+messageId).delete()
            .catch(error => {
            const { code, message } = error;
            alert(message);
        });
    }

    }
