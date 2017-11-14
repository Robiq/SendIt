var path = require('path');
var fs = require('fs');
var defPath = __dirname;
var splitter = path.sep;
cfPath=defPath+splitter+'Crypto'+splitter;
cfName='crypto';
dlPath=defPath+splitter+"Received"+splitter;
ulPath=defPath+splitter+"Send"+splitter;

function curSet(){
	var cfPrnt = cfPath+cfName+".crp";
	var string = "<h4> Current info: </h4>  <ul>E-mail:<br>" + cfName + " </ul> <ul> Cryptography file:<br> " + cfPrnt +" </ul> <ul> Download path:<br> " + dlPath + " </ul> <ul> Upload path:<br> " + ulPath + " </ul>";
	$('#curSet').html(string);
}

function readConfig(){
	try{
		var buf = fs.readFileSync(defPath + splitter + "config.conf", "utf8");
		//console.log(buf);
		buf=JSON.parse(buf);
		//console.log(buf);
		cfName = buf.cfName;
		cfPath = buf.cfPath;
		cfName = buf.cfName;
		dlPath = buf.dlPath;
		ulPath = buf.ulPath;

		$("#myMail").val(cfName);

	}catch(err){
		console.log("No config-file found!", err);
		saveConf();
	}
	curSet();
};	

function settings(){
	
	readConfig();

	$('#formInput input').on('change', function() {
		if( ($('input[name=in]:checked', '#formInput').val()) == "Manual"){
			$('#opt').show();
		} else{
			$('#opt').hide();
			cfPath=defPath+splitter+'Crypto'+splitter;
			cfName='crypto';
			dlPath=defPath+splitter+"Received"+splitter;
			ulPath=defPath+splitter+"Send"+splitter;
		}
	});

	$('#formCrypt input').on('change', function() {
		if( ($('input[name=in]:checked', '#formCrypt').val()) == "Manual"){
			$('#txtCryptoFile').show();
		} else{
			$('#txtCryptoFile').hide();	
			cfPath=defPath+splitter+'Crypto'+splitter;
			cfName='crypto.crp';
		}
	});

	$('#formDl input').on('change', function() {
		if( ($('input[name=in]:checked', '#formDl').val()) == "Manual"){
			$('#setDlLoc').show();
		} else{
			$('#setDlLoc').hide();
			dlPath=defPath+splitter+"Received"+splitter;
		}
	});

	$('#formUl input').on('change', function() {
		if( ($('input[name=in]:checked', '#formUl').val()) == "Manual"){
			$('#setUlLoc').show();
		} else{
			$('#setUlLoc').hide();
			ulPath=defPath+splitter+"Send"+splitter;

		}
	});


	$('#storeConfBtn').click(function () {
		//Save config.conf
		if($("#myMail").val() == ''){
			alert("Please fill in an email address!");
			//TODO bug!
		}else{
			saveConf();
			$("#showConfig").modal('hide');
		  	$('#createOrJoin').modal('show');
		}
		//return;
	});
};

function saveConf(){
	cfName = $("#myMail").val();
	var data = {
			"cfName": cfName,
			"cfPath": cfPath,
			"cfName": cfName,
			"dlPath": dlPath,
			"ulPath": ulPath
	}
	console.log(data);
	writeToFile(JSON.stringify(data), defPath+splitter+'config.conf');
	ensureDirectoryExistence(ulPath+"/.");
	window.location.href = "";
}

function setCrypto(){
	cfPath = $("#cryptoFile")[0].files[0].path;
	var info = path.parse(cfPath);
	cfPath = info.dir;
	cfName = info.base;
	console.log(cfPath + " " + cfName);
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
function setCfName(name){
	cfName = name;
}