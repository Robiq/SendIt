/*
File for calling correct order of keyManager methods.
Also for checking for crypto-file and managing other semi-related crypto-things

function readCrypto(){
	cryptofile = $("#cryptoFile");
	console.log(cryptofile);
}


//If file doesn't exist, require text-field input to continue.
//If it exists, hide text-field!
console.log(cfExists);
if(!cfExists){
  $('#txtMyMail').show();
  $('#createBtn').prop('disabled', true);
  $('#joinBtn').prop('disabled', true);
  $("#myMail").show();
  $("#myMail").keyup( function() {
    if( $(this).val() != '') {
      $('#createBtn').prop('disabled', false);
      $('#joinBtn').prop('disabled', false);
    }else{
      $('#createBtn').prop('disabled', true);
      $('#joinBtn').prop('disabled', true);
    }
  });
}else{
	$('#txtRecMail').hide();
}
*/
//Main crypto function
function crypto(){
	if (findCrypto()){
		readCrypto();
	}else{
		createCrypto();
	}
}
//Behaviour to test for existing cryptofile
function findCrypto(){
	return;//true or false
}
//Behaviour for instancing a new keymanager and Cryptofile
function createCrypto(){
	//Create new manager
	KeyManager = new KeyManager(null);
}
//Behaviour for reading an old cryptofile in to a keymanager
function readCrypto(){
	//read data
	KeyManager = new KeyManager(data);
}
//Behaviour for writing keymanager to cryptofile
function writeCrypto(){
	return;
}