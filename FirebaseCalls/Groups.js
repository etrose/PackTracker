import React from 'react';
import firebase from "firebase";

export default class Groups extends React.Component {
    constructor(curr_id, curr_username) {
        super();
        this.state = { 
            curr_id,
            curr_username,
        };
    }

    async createGroup(groupName, city, state) {
        const that = this;
        firebase.database().ref('groups/'+groupName).once('value', function(snapshot) {
            if (snapshot.exists()) {
              return false;
            }else {
              firebase.database().ref('groups/'+groupName).set({
                city,
                state,
                memberCount: 1,
              }).then(() => {
                return true;
              });
            }
          }).then(() => {
              that.addMember(groupName, 'founder');
          });
    }

    async addMember(groupName, position='member') {
        currUserId = this.state.curr_id;
        currUsername = this.state.curr_username;
        //console.log(currUserId);
        firebase.database().ref('groups/'+groupName+'/members/'+currUserId).set({
            username: currUsername,
            position
        }).then(()=> {
            firebase.database().ref('users/'+currUserId+'/groups/'+groupName).set({
                position
            });
        });
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

    }
