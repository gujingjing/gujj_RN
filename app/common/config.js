'use strict'

module.exports={

	header:{
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  }
	},
	api:{
		base:'http://rap.taobao.org/mockjs/15310/',
        base2:'http://rapapi.org/mockjs/16811/',
		creations:'api/creations',
        up:'api/up',
        component:'api/component',
        note:'api/note',
        sinCode:'api/usersignup',
        login:'api/login'

	}


}