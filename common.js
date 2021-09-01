window.wf = {
	version: '0.9.0',
	fn: {
		login: function() {
			var id = $('#username').val();
			var pw = $('#userpassword').val();
			$.post("/rest/login", { id: id, pw: pw },
				   function(data, status) {
					   if ( data.member['id'] ) {
						   location.reload(true);
					   }
				   }
				  );
			return false;
		},
		logout: function() {
			$.post("/wf/logout", 
				   function(data, status) {
		//			   location.replace('/wf/00_001.html');
				   }
				  );
			return false;
		}
	}
};
(function() {
	switch (window.path) {
	case '00_001': /* login page */
		$('form').off().on('submit', window.wf.fn.login); 
		break;
	default:
		break;
	}
})();
