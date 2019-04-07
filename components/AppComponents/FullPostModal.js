import React from 'react';
import { View, Text, ActivityIndicator, TextInput, StyleSheet, Platform, FlatList} from 'react-native';
import Modal from 'react-native-modal';
import { Icon } from 'expo';
import Colors from '../../constants/Colors';
import { AuthPages } from '../../constants/Layout';
import Groups from '../../FirebaseCalls/Groups';
import firebase from "firebase";

export default class FullPostModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      isModalVisible: false,
      loading: false,
      op_username: '',
      comment: '',
      title: this.props.title,
      body: '',
      likes: '',
      timestamp: '',
      oldTimestamp: '',
      post_id: '',
      currId: this.props.id,
      called: false,
      comments: [],
    });
  }

  async componentDidUpdate() {
    if(this.state.called) {
      if(this.state.timestamp != this.state.oldTimestamp) {
          this.setState({loading: true});
          this.loadComments();
      }
    }
  }

    _toggleModal = () => {
      this.setState({ isModalVisible: !this.state.isModalVisible });
    }
    
    async onCreatePressed() {
        
    }

    async loadComments() {
        var that = this;
        var temp = [];
        firebase.firestore().collection('posts/'+this.state.post_id+'/comments')
            .get().then((snapshot)=> {
            var i = snapshot.size;
            if(i == 0) {
                that.setState({loading: false});
            }else {
            snapshot.forEach((doc)=> {
                i--;
                var data = doc.data();
                var mytimestamp = new Date(JSON.parse(data.timestamp));
                var time = that.getTimeSince(mytimestamp);
                firebase.firestore().doc('posts/'+this.state.post_id+'/comments/'+doc.id+'/likers/'+this.props.curr_user)
                    .get().then((likerDoc)=>{
                        temp.push({
                            comment_id: doc.id,
                            username: data.username,
                            comment: data.comment,
                            likes: data.likes,
                            liked: likerDoc.exists,
                            timestamp: time,
                            user_id: data.user_id
                        });
                        if(i == 0) {
                        temp.sort((a,b)=> (a.likes > b.likes) ? -1 : 1);
                        that.setState({loading: false});
                        }
                    });
                });
            }
            }).catch((error)=> {
                alert(error);
        });
        this.setState({oldTimestamp: this.state.timestamp, comments: temp});
    }

    async sendComment() {
        if(this.state.comment.length > 0) {
            var serialized = JSON.stringify(new Date());
            var that = this;
            firebase.firestore().collection('posts/'+this.state.post_id+'/comments').add({
                comment: this.state.comment,
                likes: 0,
                timestamp: serialized,
                username: this.props.curr_user,
                user_id: this.props.curr_id
            }).then((myComment)=> {
                var timeSince = this.getTimeSince(new Date());
                that.setState({
                comments: this.state.comments.concat({
                    comment_id: myComment.id,
                    comment: this.state.comment,
                    likes: 0,
                    liked: false,
                    timestamp: timeSince,
                    username: this.props.curr_user,
                    user_id: this.props.curr_id
                }),
            });
            this.textInput.clear();
            }).catch(error => {
                const { code, message } = error;
                alert(message);
            });
        }
    }


    async doLike(index, current) {
        let comments = [...this.state.comments];
        let item = {...comments[index]};
        item.liked = !current;
        current ? item.likes-- : item.likes++;
        comments[index] = item;
        this.setState({comments});
        const g = new Groups(this.state.curr_id, this.props.curr_user);
        g.like(this.state.post_id, this.props.curr_user, item.comment_id);
    }

    getTimeSince(myTimestamp) {
        var time = Math.floor(Math.abs((new Date()) - myTimestamp) / 1000);
            var ext = "second";

            if(time > 60) {
                time = Math.floor(time/60);
                ext = "minute";
            }
            if(ext === "minute" && time > 60) {
                time = Math.floor(time/60);
                ext = "hour";
            }
            if(ext === "hour" && time > 24) {
                time = Math.floor(time/24);
                ext = "days";
            }
                    
        return time + " " + ext + "(s) ago";
    }

    render() {
        return (
          <View style={ styles.container }>
            <Modal style={{ margin: 0, alignItems: 'center', justifyContent: 'center'}}
              isVisible={this.state.isModalVisible}
              onBackdropPress={()=> this._toggleModal()}>
              <View style={styles.backgroundView}>
              <View style={styles.modal}>

                <View style={styles.topBar}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                    <Text style={styles.op}>{this.state.op_username}</Text>
                    <Icon.Ionicons onPress={this._toggleModal} name={Platform.OS === 'ios'? 'ios-close' : 'md-close'} color="black" size={20}/>
                </View>
                <Text style={{fontSize: 22, fontWeight: 'bold'}}>{this.state.title}</Text>
                <Text style={styles.bodyText}>{this.state.body}</Text>
                </View>
                {!this.state.loading ? 
                <FlatList 
                style={styles.flatList}
                data={this.state.comments}
                renderItem={({ item, index }) => (
                    <View style={styles.listItemContainer}>
                    <View style={{maxWidth: '90%'}}>
                        <Text style={styles.commentUsername}>{item.timestamp}</Text>
                        <Text style={[styles.commentUsername, styles.op]}>{item.username}</Text>
                        <Text style={styles.bodyText}>{item.comment}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                    <Icon.Ionicons style={{paddingRight: 5}} 
                    onPress={()=> this.doLike(index, item.liked)}
                    name={Platform.OS === 'ios'? 'ios-paw' : 'md-paw'} color={item.liked ? Colors.tintColor : Colors.lightText} size={25}/>
                    <Text style={styles.likeText}>{item.likes}</Text>
                    </View>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                /> : <ActivityIndicator size='large'/>}

                <View style={styles.commentInputContainer}>
                <View style={{padding: 10, alignItems: 'center', width: '85%'}}>
                  <View style={[AuthPages.inputContainer, {marginTop: 0, width: '100%'}]}>
                  <TextInput style={[AuthPages.inputBox, {minHeight: 30, maxHeight: 120, width: '100%',  padding: 5}]}
                      maxLength={144}
                      fontSize={16}
                      
                      multiline={true}
                      underlineColorAndroid="transparent"
                      placeholder="Join the discussion..."
                      placeholderTextColor={Colors.text}
                      onChangeText={text => this.setState({ comment: text })}
                      ref={component => this.textInput = component}
                  /></View>
                  </View>
                  <Icon.Ionicons onPress={()=> this.sendComment()} style={{paddingHorizontal: 15}} name={Platform.OS === 'ios'? 'ios-send' : 'md-send'} color={Colors.tintColor} size={30}/>
                </View>
              </View>
              </View>
            </Modal>
          </View>
        );
      }
    }
    const styles = StyleSheet.create({
        container: {
          //padding: 20,
          alignItems: 'center',
        },
        topBar: {
            width: '100%',
            padding: 15,
            backgroundColor: '#fff',
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            elevation: 10,
            borderBottomColor: '#000',
            borderBottomWidth: StyleSheet.hairlineWidth,
        },
        backgroundView: {
          width: '100%',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 23,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        },
        modal: {
          backgroundColor: '#fff', 
          //padding: 10, 
          width: "95%", 
          borderRadius: 10,
          justifyContent: 'space-between',
          alignItems: 'center',
          elevation: 10,
        },
        op: {
            color: Colors.tintColor,
            fontWeight: 'bold'
        },
        commentUsername: {
            color: Colors.lightText,
            fontSize: 12,
        },
        likeText: {
            color: Colors.lightText,
            fontSize: 14,
        },
        bodyText: {
            fontSize: 14,
            color: Colors.text,
        },
        linkText: {
          fontSize: 16,
          color: Colors.colorSecondary,
          fontWeight: 'bold',
        },
        commentInputContainer: {
            flexDirection: 'row', 
            alignItems: 'center', 
            width: '100%',
            backgroundColor: '#fff',
            borderTopColor: '#000',
            borderTopWidth: StyleSheet.hairlineWidth,
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
        },
        listItemContainer: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 10,
            backgroundColor: '#fff',
            borderBottomColor: '#000',
            borderBottomWidth: StyleSheet.hairlineWidth,
        },
        flatList: {
            width: '100%',
            maxHeight: 400,
            backgroundColor: '#ddd',
        }
    });
  
