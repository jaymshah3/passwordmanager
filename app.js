console.log('starting password manager');
var crypto = require('crypto-js');
var storage  = require('node-persist');
storage.initSync(); 

var argv = require('yargs')
.command('create', 'creates an entry', function(yargs) {
	yargs.options({
		name: {
			demand: true,
			alias: 'n',
			description: 'Your account type name goes here',
			type: 'string'
		},
		username: {
			demand: true,
			alias: 'u',
			description: 'Your username goes here',
			type:'string'
		},
		password: {
			demand: true,
			alias: 'p',
			description: 'Your password goes here',
			type: 'string' 
		},
		masterPassword: {
			demand: true,
			alias: 'm',
			description: 'Your master password goes here',
			type: 'string'
		}
	}).help('help');
})
.command('get', 'gets user and password', function (yargs){
	yargs.options({
		name: {
			demand: true,
			alias: 'n',
			description: 'Account Name',
			type: 'string'
		},
		masterPassword: {
			demand: true,
			alias: 'm',
			description: 'Your master password goes here',
			type: 'string'
		}
	}).help('help');
})
.help('help')
.argv;
var command = argv._[0];


function getAccounts(masterPassword) {
	var encryptedAccount = storage.getItemSync('accounts');
	var accounts = [];
	if(typeof encryptedAccount !== 'undefined'){
		var bytes = crypto.AES.decrypt(encryptedAccount, masterPassword);
		accounts = JSON.parse(bytes.toString(crypto.enc.Utf8));

	}
	return accounts;
}


function saveAccounts(accounts, masterPassword){
	var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts), masterPassword);

	storage.setItemSync('accounts', encryptedAccounts.toString());
	return accounts;

}



function createAccount (account, masterPassword){
var accounts = getAccounts(masterPassword);

accounts.push(account);

saveAccounts(accounts, masterPassword);

return account;
}


function getAccount (accountName, masterPassword){
	var accounts = getAccounts(masterPassword);
	var matchedAccount;
accounts.forEach(function (account){
	if(account.name == accountName){
		matchedAccount = account;
	}
});
return matchedAccount;
}

if(command === 'create'){
	try{
	var createAccount = createAccount({ 
		name: argv.name,
		username: argv.username,
		password: argv.password

	}, argv.masterPassword);
	console.log('Account created!');
	console.log(createAccount);

}
catch(e){

	console.log('Unable to create an account.');
}
}
else if(command === 'get'){
	try{
	var fetchedaccount = getAccount(argv.name,argv.masterPassword);
	if (typeof fetchedaccount === 'undefined'){
		console.log('Account not found');
	}
	else{
		console.log('Account found!');
		console.log(fetchedaccount);
	}
}
catch(e){

	console.log('Unable to get an account.');
}
}










