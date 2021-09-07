window.wf = {
	version: '0.9.0',
	fn: {
		changePasswd: function() {
			var newPw = $('#userpassword').val();
			var confirmPw = $('#userpassword_re').val();
			if ( newPw == confirmPw ) {
				$.post("/rest/change_pw", { new_pw: newPw, confirm_pw: confirmPw },
					   function(data, status) {
						   if ( data.result ) {
							   location.reload(true);
						   }
						   else {
							   alert('비밀변호 변경에 실패하였습니다.');
						   }
					   }
					  );
			}
			else {
				alert('변경 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
			}
			return false;
		},
		login: function() {
			var id = $('#username').val();
			var pw = $('#userpassword').val();
			$.post("/rest/login", { id: id, pw: pw },
				   function(data, status) {
					   if ( data.member['id'] ) {
						   location.reload(true);
					   }
					   else {
						   alert('로그인 정보가 유효하지 않습니다.');
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
	/* top menu */
	$('#page-topbar .navbar-header .dropdown-item').on('click', function(e) {
		if ($(this).find('.uil-user-circle').length > 0 ) {
			location.href ='/wf/03_001_0001.html';
		}
	})
	
	switch (window.path) {
	case '00_001': /* login page */
		$('form').off().on('submit', window.wf.fn.login); 
		break;
	case '00_002': /* 1st password change page */
		$('form').off().on('submit', window.wf.fn.changePasswd); 
		break;
	default:
		break;
	}
})();
