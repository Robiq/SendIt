var path = require('path');
var fs = require('fs');
const get = require('../userDest.js');
// include the ipc module to communicate with main process.
const ipcRenderer = require('electron').ipcRenderer; 

var myMail='';
//TODO fix correct address!
var server= '';
var serverChange=false;
var defPath = new get();
defPath = defPath.get();
var splitter = path.sep;
cfPath=defPath+splitter+'Crypto'+splitter;
cfName='crypto.crp';
dlPath=defPath+splitter+"Received"+splitter;
ulPath=defPath+splitter+"Send"+splitter;
var selCrypto=0;

//Print current settings
function curSet(){
	var cfPrnt = cfPath+cfName;
	var string = "<ul><h4> Cryptography file:</h4>" + cfPrnt +" </ul> <ul><h4> Download path:</h4>" + dlPath + " </ul> <ul><h4> Upload path:</h4>" + ulPath + " </ul>";
	$('#curSet').html(string);
}

//Read config file
function readConfig(){
	try{
		var buf = fs.readFileSync(defPath + splitter + "config.conf", "utf8");
		//console.log(buf);
		buf=JSON.parse(buf);
		//console.log(buf);
		cfName = buf.cfName;
		cfPath = buf.cfPath;
		dlPath = buf.dlPath;
		ulPath = buf.ulPath;
		myMail = buf.myMail;
		server = buf.server;

		$("#myMail").val(myMail);
		$("#url").val(server);

	}catch(err){
		console.log("No config-file found!", err);
		saveConf(true);
	}
}

function keyManagement(){
	//Key management in settings
	$('#cryptoOpt').html('');
	//Button to remove cryptofile
	var remove = $('<button/>', {
				text: "Remove ALL current keys!",
				id: "removeCryptoBtn",
				click: removeCrypto
			});
	$('#cryptoOpt').append(remove);
	$('#cryptoOpt').append("<br>");
	var html;	
	if( existCrypto() ){
		//No foreign keys
		if($.isEmptyObject(km.keys)){
			$('#cryptoOpt').append('<h4 style="color: red;">No Cryptography information to display!</h4>');
		}else{
			//Foreign keys exist
			var txt = "<h4>Remove keys for:</h4>"
			$('#cryptoOpt').append(txt);
			for(email in km.keys){
				var btn;
				btn=$('<button/>', {
					text: email,
					id: email,
					click: removeEntry
				});
				$('#cryptoOpt').append(btn);
				$('#cryptoOpt').append("<br>");
			}
		}
	//No cryptofile
	} else {
		$('#cryptoOpt').append('<h4 style="color: red;">No Cryptography information to display!</h4>');
	}
}

function settings(){
	readConfig();
	curSet();
	keyManagement();

	//Show selection if change in radio buttons for manual settings
	$('#formServer input').on('change', function() {
		serverChange=!serverChange;
		if( ($('input[name=in]:checked', '#formServer').val()) == "Manual"){
			$('#serverAddr').hide();
			server='';
			$("#url").val(server);
		} else {
			$('#serverAddr').show();
			$("#url").val(server);
		}
		//console.log(serverChange);
	});

	//Show selection if change in radio buttons for manual settings
	$('#formInput input').on('change', function() {
		if( ($('input[name=in]:checked', '#formInput').val()) == "Manual"){
			$('#opt').show();
		} else {
			$('#opt').hide();
			cfPath=defPath+splitter+'Crypto'+splitter;
			cfName='crypto.crp';
			dlPath=defPath+splitter+"Received"+splitter;
			ulPath=defPath+splitter+"Send"+splitter;
		}
	});

	//Show selection if change in radio buttons for crypto file
	$('#formCrypt input').on('change', function() {
		if( ($('input[name=in]:checked', '#formCrypt').val()) == "Manual"){
			$('#txtCryptoFile').show();
		} else{
			$('#txtCryptoFile').hide();	
			cfPath=defPath+splitter+'Crypto'+splitter;
			cfName='crypto.crp';
			selCrypto=0;
		}
	});

	//Show selection if change in radio buttons for download
	$('#formDl input').on('change', function() {
		if( ($('input[name=in]:checked', '#formDl').val()) == "Manual"){
			$('#setDlLoc').show();
		} else{
			$('#setDlLoc').hide();
			dlPath=defPath+splitter+"Received"+splitter;
		}
	});

	//Show selection if change in radio buttons for upload
	$('#formUl input').on('change', function() {
		if( ($('input[name=in]:checked', '#formUl').val()) == "Manual"){
			$('#setUlLoc').show();
		} else{
			$('#setUlLoc').hide();
			ulPath=defPath+splitter+"Send"+splitter;

		}
	});

	//Button to reset config
	$('#resetConfig').click(function () {
		cfPath=defPath+splitter+'Crypto'+splitter;
		cfName='crypto.crp';
		dlPath=defPath+splitter+"Received"+splitter;
		ulPath=defPath+splitter+"Send"+splitter;
		myMail='';
		$("#myMail").val(myMail);
		saveConf();
	});

	//Button to store config
	$('#storeConfBtn').click(function () {
		//Save config.conf
		if($("#myMail").val() == ''){
			alert("Please fill in an email address!");
		}else{
			saveConf();
			keyManagement();
		}
		//return;
	});
	$('#saveServBtn').click(saveServ);
	$('#resetServBtn').click(resetServ);

}
//Save config to config.conf
function saveConf(init=false){
	myMail = sanatize( $("#myMail").val() );
	if(!init && cfName == 'crypto.crp' || cfName == '.crp'){
		cfName = myMail+'.crp';
		console.log('Creating cfName for ' + myMail);
	}else if(cfName != myMail+'.crp' && selCrypto==0){
		cfName = myMail+'.crp';
	}
	var data = {
			"cfName": cfName,
			"cfPath": cfPath,
			"dlPath": dlPath,
			"ulPath": ulPath,
			"myMail": myMail,
			"server": server
	}
	console.log("Data written: ", data);
	writeToFile(JSON.stringify(data), defPath+splitter+'config.conf', init);
	ensureDirectoryExistence(ulPath+"/.");
	if(serverChange){
		var useServ=true;
		if(server==''){
			useServ=false;
		}
		//send the info to main process . we can pass any arguments as second param.
		ipcRenderer.send('server', useServ); // ipcRender.send will pass the information to main process
	}else{

		if(!init){
			settings();
		}else{
			alert("Please move or copy the files you want to send to: \n" + ulPath);
		}
	}
}
//Set crypto file
function setCrypto(){
	cfPath = $("#cryptoFile")[0].files[0].path;
	console.log(cfPath);
	var info = path.parse(cfPath);
	cfPath = info.dir+splitter;
	cfName = info.base;
	console.log(cfPath + " " + cfName);
	selCrypto=1;
	readCrypto();
}
function setDownload(){
	dlPath = $("#downloadFolder")[0].files[0].path;
	console.log(dlPath);
}
function setUpload(){
	ulPath = $("#uploadFolder")[0].files[0].path;
	console.log(ulPath);
}
function setMail(mail){
	myMail = mail;
	console.log("Mail: "+mail);
}
//Remove a email+key pair
function removeEntry(){
	let id=this.id;
	if( window.confirm("Are you sure you want to remove the key for " + id +"?") ){
		delete km.keys[id];
		alert("Removed key: " + id);
		km.getObjectData();
		window.location.href = "";
	}
}
//Delete cryptofile
function removeCrypto(){
	if( window.confirm("Are you sure you want to remove your cryptography file?") ){
		try{
			fs.unlinkSync(cfPath+cfName);
			alert("Cryptography file removed!");
		}catch(e){
			console.log(e);
		}
	}
}

function saveServ(){
	server = sanatize( $("#url").val() );
	$("#url").val(server);
	console.log("server: ", server);
}

function resetServ(){
	//todo fix correct address!
	server = 'asdf';
	$("#url").val(server);
	console.log("server: ", server);
}