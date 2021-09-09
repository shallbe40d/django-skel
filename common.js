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
			add: function() {
				var id = $('#ID_form').val(); 
				var name = $('#name_form').val(); 
				var pw = $('#PW_form').val(); 
				var pw2 = $('#PW2_form').val(); 
				var email = $('#email_form').val(); 
				var tel = $('#tel_form').val(); 
				var role = ($('input[name=formRadio1]:checked').attr('id') == 'a_form1') ? -1 : 1;
				
				if (!id) {
					$('#ID_form').addClass('is-invalid').siblings('.invalid-text').show();
				}
				if (!name) {
					$('#name_form').addClass('is-invalid').siblings('.invalid-text').show();
				}
				if (!pw) {
					$('#PW_form').addClass('is-invalid').siblings('.invalid-text').show();
				}
				if (!pw2) {
					$('#PW2_form').addClass('is-invalid').siblings('.invalid-text').show();
				}

				if (pw != pw2) {
					$('#PW2_form').addClass('is-invalid');
					alert('비밀번호와 확인용 비밀번호가 일치하지 않습니다');
					return;
				}

				if ( $('.invalid-text:visible').length == 0 ) {
					$.post("/rest/member_add", {id: id, pw: pw, name: name, email: email, tel: tel, role: role},
						   function(data, status) {
							   window.wf['log'] = data;
							   $('#saveModalF').removeClass('hide').addClass('show');
						   }
						  );
				}
				return false;
			},
			get: function() {
				var searchType = '';
				$.get("/rest/member_list", {},
					  function(data, status) {
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

	case '03_001_0002': /* 사용자 추가 */
		$('.invalid-text').hide();
		$('.is-invalid').removeClass('is-invalid');
		$("input").on("propertychange change keyup paste input", function() {
			$(this).removeClass('is-invalid').siblings('.invalid-text').hide();
		});

		$('div.text-end > button.btn-light').on('click', function() {
			$('form').reset();
		});
		$('form').off().on('submit', function() {return false});
		$('div.text-end > button.btn-primary').parent().off();
		//$('#saveModal').attr('id', 'saveModalF');
		$('div.text-end > button.btn-primary').off().on('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation()
			window.wf.fn.member.add();
			return false;
		});
		break;

	default:
		break;
	}
})();
