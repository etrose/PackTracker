import { Dimensions, StyleSheet } from 'react-native';
import Colors from './Colors';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const AuthPages = StyleSheet.create({
  container: {
    backgroundColor:Colors.background,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpCont: {
    justifyContent:'flex-end',
    flexGrow: 1,
    flexDirection:'row',
    paddingVertical:16,
  },
  signUpText: {
    color:Colors.tintColor,
    fontSize:16,
  },
  signUpButton: {
    color:Colors.tintColor,
    fontSize:16,
    fontWeight:'500',
  },
  inputContainer: {
    width: "80%",
    marginTop: 15,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: Colors.text,
    borderRadius: 25,
  },
  inputBox: {
    width: 300,
    paddingHorizontal:20,
    paddingVertical: 5,
    fontSize:18,
    color: Colors.text,
  },
  button: {
    width:300,
    marginTop: 30,
    borderRadius: 25,
  },
  buttonText: {
    //backgroundColor: 'rgba(255,255,255,.3)',
    backgroundColor:Colors.tintColor,
    borderRadius:25,
    paddingHorizontal:16,
    paddingVertical:12,
    fontSize:16,
    fontWeight:'500',
    textAlign:'center',
    color:Colors.buttonText,
  },
});

export const Buttons = StyleSheet.create({
  button: {
    width:300,
    marginTop: 30,
    borderRadius: 25,
  },
  buttonText: {
    backgroundColor:Colors.tintColor,
    borderRadius:25,
    paddingHorizontal:16,
    paddingVertical:12,
    fontSize:16,
    fontWeight:'500',
    textAlign:'center',
    color:Colors.buttonText,
  },
});

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
};
