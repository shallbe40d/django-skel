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
		member: {
			get: function() {
				var searchType = '';
				$.get("/rest/member_list", {},
					  function(data, status) {
						  window.wf['data'] = data;
						  //data.member => list
						  var tbody = $('#userList > tbody');
						  var trs = tbody.find('tr');
						  var row = $(trs.get(0)).clone();
						  trs.remove();
						  for ( i in data.member ) {
							  var elm = row.clone();
							  elm.find('td').get(0).innerText = data.member[i].name;
							  elm.find('td').get(1).innerText = data.member[i].id;
							  elm.find('td').get(2).innerText = data.member[i].email;
							  elm.find('td').get(3).innerText = data.member[i].tel;
							  elm.find('td').get(4).innerText = data.member[i].role;
							  elm.find('td').get(5).innerText = data.member[i].id;
							  elm.find('td').get(6).innerText = data.member[i].name;
							  
							  tbody.append(elm);
						  }
					  }
					 );
			}
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
			location.href = '/wf/03_001_0001.html';
		}
	})
	
	switch (window.path) {
	case '00_001': /* login page */
		$('form').off().on('submit', window.wf.fn.login); 
		break;
	case '00_002': /* 1st password change page */
		$('form').off().on('submit', window.wf.fn.changePasswd); 
		break;
	case '03_001_0001': /* member list */
		/* 사용자 추가 */
		$('div.row a.btn-success').on('click', function() {
			location.href = '/wf/03_001_0002.html';
		});
		window.wf.fn.member.get();
		break;
	default:
		break;
	}
})();
