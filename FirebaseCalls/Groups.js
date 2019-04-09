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
        return new Promise(resolve => {
        firebase.database().ref('groups/'+groupName).once('value', function(snapshot) {
            if (snapshot.exists()) {
                alert("An existing group has this name.");
                resolve(false);
            }else {
              firebase.database().ref('groups/'+groupName).set({
                city,
                state,
                memberCount: 0,
              }).then(() => {
                  alert(groupName + " created!");
                    that.addMember(groupName, 'founder');
                    resolve(true);
              });
            }
          });
        });
    }

    async addMember(groupName, position='member') {
        currUserId = this.state.curr_id;
        currUsername = this.state.curr_username;
        //console.log(currUserId);
        firebase.database().ref('groups/'+groupName+'/members/'+currUsername).set({
            id: currUserId,
            position
        }).then(()=> {
            firebase.database().ref('users/'+currUserId+'/groups/'+groupName).set({
                position
            }).then(()=> {
                firebase.database().ref('groups/'+groupName).transaction(function(group) {
                if (group) {
                    group.memberCount++;
                }
                return group;
                });
            });
        });
    }
    
    async removeMember(groupName, userToRemove, idToRemove) {
        if(idToRemove == null || userToRemove == null) {
            idToRemove = this.state.curr_id;
            userToRemove = this.state.curr_username;
        }
        firebase.database().ref('groups/'+groupName+'/members/'+userToRemove).remove().then(()=> {
            firebase.database().ref('users/'+idToRemove+'/groups/'+groupName).remove();
        }).then(()=> {
            firebase.database().ref('groups/'+groupName).transaction(function(group) {
                if (group) {
                    group.memberCount--;
                }
                return group;
                });
        }).catch(error => {
            const { code, message } = error;
            alert(message);
        });
    }

    async createPost(group, title, body) {
        var serialized = JSON.stringify(new Date());

        firebase.firestore().collection('posts').add({
            group,
            title,
            body,
            timestamp: serialized,
            likes: 0,
            commentCount: 0,
            op_username: this.state.curr_username,
            op_id: this.state.curr_id,
            featured: false,
        }).catch(error => {
            const { code, message } = error;
            alert(message);
        });
    }

    async comment(post_id, comment) {
        var serialized = JSON.stringify(new Date());
        firebase.firestore().collection('posts/'+post_id+'/comments').add({
            comment,
            likes: 0,
            timestamp: serialized,
            username: this.state.curr_username,
            user_id: this.state.curr_id
          })
        //.then(()=> {
        //     console.log("HELLO WORLD");
        //     postRef.get().then((post)=> {
        //         var commentCount = post.data().commentCount;
        //         console.log(commentCount);
        //         commentCount++;
        //         postRef.update({commentCount});
        //     });
        //     return;
        // })
        .catch(error => {
            const { code, message } = error;
            alert(message);
        });
        firebase.firestore().doc('posts/'+post_id).get().then((post)=> {
            var commentCount = post.data().commentCount;
            console.log(commentCount);
            commentCount++;
            firebase.firestore().doc('posts/'+post_id).update({commentCount});
        });
    }

    async like(post_id, username, comment_id) {
        var postRef;
        var likerRef;
        if(comment_id == undefined) {
        postRef = firebase.firestore().doc('posts/'+post_id);
        likerRef = firebase.firestore().doc('posts/'+post_id+'/likers/'+username);
        }else {
        postRef = firebase.firestore().doc('posts/'+post_id+'/comments/'+comment_id);
        likerRef = firebase.firestore().doc('posts/'+post_id+'/comments/'+comment_id+'/likers/'+username);
        }

        postRef.get().then((doc)=> {
            var likeCount = doc.data().likes;

            //Check if user has already like the post
            likerRef.get().then((thisUserLiked)=> {
                if(!thisUserLiked.exists) {
                    //Create document for this user in likers
                    return likerRef.set({liked:true}).then(()=>{
                        likeCount++;
                        postRef.update({likes:likeCount});
                    });
                }else {
                    return likerRef.delete().then(()=>{
                        likeCount--;
                        postRef.update({likes:likeCount});
                    });
                }
            });
        }).catch(error => {
            const { code, message } = error;
            alert(message);
        });
    }

    }
