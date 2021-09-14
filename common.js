/**
+--------------------------+
|     Common Functions     |
+--------------------------+
*/
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
/**
+--------------------------+
|     WireFrame Objecs     |
+--------------------------+
*/
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
							   $('#saveModalF').modal('show');
							   $('#saveModalF').find('button.btn.btn-success').off().on('click', function() {
								   $('#saveModalF').modal('hide');
							   });
							   $('form')[0].reset();
						   }
						  );
				}
				return false;
			},
			chagePw: function(id, pw) {
				$.post("/rest/member/update/" + id, { pw: pw },
				   function(data, status) {
					   if ( data.result ) {
						   $('#pwModal').modal('hide');
						   alert('비밀번호가 변경되었습니다.');
					   }
					   else {
						   alert('로그인 정보가 유효하지 않습니다.');
					   }
				   }
				  );
			},
			del: function(id) {
				$.get("/rest/member/delete/" +  id, {},
					  function(data, status) {
						  window.wf['log'] = data;
						  if ( data.result ) {
							  location.href = '/wf/03_001_0001.html';
						  }
					  }
					 );
			},
			get: function(id, callback) {
				$.get("/rest/member/" +  id, {},
					  function(data, status) {
						  window.wf['log'] = data;
						  callback(data);
						  
					  }
					 );
			},
			list: function() {
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
							  elm.find('td').get(5).innerText = data.member[i].createDt;
							  elm.find('td').get(6).innerText = data.member[i].pid;
							  elm.attr('idx', data.member[i].idx);
							  elm.off().on('click', function() {
								  location.href='/wf/03_001_0003.html?id=' + $(this).attr('idx');
							  });
							  tbody.append(elm);
						  }
					  }
					 );
			},
			update: function(id, obj) {
				$.post("/rest/member/update/" + id, obj,
				   function(data, status) {
					   if ( data.result ) {
						   alert('회원정보가 변경되었습니다.');
					   }
					   else {
						   alert('로그인 정보가 유효하지 않습니다.');
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
/**
+-----------------------+
|     JQuery Onload     |
+-----------------------+
*/
(function() {
	/// 상단 메뉴
	$('#page-topbar .navbar-header .dropdown-item').on('click', function(e) {
		/// 사용자 관리
		if ($(this).find('.uil-user-circle').length > 0 ) {
			location.href = '/wf/03_001_0001.html';
		}
	})
	
	switch (window.path) {
	case '00_001': { /* 로그인 페이지login page */
		$('form').off().on('submit', window.wf.fn.login);
		break;
	}

	case '00_002': { /* 최초 로그인 시 비밀번호 변경 */
		$('form').off().on('submit', window.wf.fn.changePasswd); 
		break;
	}

	case '01_001': { /* IoT 센서 */
		var notExistSensor = $('div.main-content div.container-fluid div.row:nth-child(3)');
		var listSensor = $('div.main-content div.container-fluid div.row:nth-child(4)');
		var sensorClone = listSensor.find('> div:first-child').clone();
		var objList = window['device']['iot']['iot_info'];

		if ( objList.length > 0) {
			notExistSensor.hide();
			listSensor.empty();

			for ( var i=0; i < objList.length; i++ ) {
				var newSensor = sensorClone.clone();

				var sType = objList[i]['sensor_type'];
				var sId = objList[i]['sensor_id'];
				var sSamplerate = objList[i]['samplerate'];
				var sPos = objList[i]['sensor_pos'] | objList[i]['sensor_position'];
				var sX = objList[i]['x_axis'] || '';
				var sY = objList[i]['y_axis'] || '';
				var sZ = objList[i]['z_axis'] || '';

				var tbody = newSensor.find('table.table.mb-0 > tbody');
				/// 센서 종류
				tbody.find('> tr:first-child > td:nth-child(2) > strong').text(( sType && sType == "iot_v" ) ? "진동": "소음");
				tbody.find('> tr:nth-child(2) > td:nth-child(2)').text(sId);
				tbody.find('> tr:nth-child(3) > td:nth-child(2)').text(sSamplerate);
				tbody.find('> tr:nth-child(4) > td:nth-child(2)').text(sPos);
				if ( !sX && !sY && !sZ ) {
					tbody.find('> tr:nth-child(5)').hide();
				}
				else {
					tbody.find('> tr:nth-child(5)').show();
					tbody.find('> tr:nth-child(5) > td > dl > dd:nth-child(1)').text(sX);
					tbody.find('> tr:nth-child(5) > td > dl > dd:nth-child(2)').text(sY);
					tbody.find('> tr:nth-child(5) > td > dl > dd:nth-child(3)').text(sZ);
				}

				listSensor.append(newSensor);
			}
		}
		else {
			listSensor.hide();
		}

		/// 등록
		var regForm = $('#sensorRegisterModal');
		var rType = regForm.find('input[name=formRadios]:checked').attr('id');
		//vibration_form1
		var rId = regForm.find('#sensor_ID_form1').val();
		var rSamplerate = regForm.find('#samplerate_form1').val();
		var rPos = regForm.find('select.form-select:nth-child(1):selected');

		break;
	}
		
	case '03_001_0001': { /* 사용자 리스트 */
		/* 사용자 추가 */
		$('div.row a.btn-success').on('click', function() {
			location.href = '/wf/03_001_0002.html';
		});
		window.wf.fn.member.list();
		break;
	}

	case '03_001_0002': { /* 사용자 추가 */
		$('.invalid-text').hide();
		$('.is-invalid').removeClass('is-invalid');
		$("input").on("propertychange change keyup paste input", function() {
			$(this).removeClass('is-invalid').siblings('.invalid-text').hide();
		});

		$('div.text-end > button.btn-light').on('click', function() {
			$('form')[0].reset();
		});
		$('form').off().on('submit', function() {return false});
		$('div.text-end > button.btn-primary').parent().off();
		$('#saveModal').attr('id', 'saveModalF');
		$('div.text-end > button.btn-primary').off().on('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation()
			window.wf.fn.member.add();
			return false;
		});
		break;
	}	

	case '03_001_0003': { /* 사용자 상세 */
		/// 사용자 idx 값
		var memberId = getUrlVars()['id'];
		/// 사용자 값 초기화
		$('div.row.p-2 > div:nth-child(2)').text('')
		/// 삭제 버튼
		$('div.row div.text-end > button:nth-child(1)').off().on('click', function() {
			window.wf.fn.member.del(memberId);
		});
		/// 비밀번호 재설정 버튼 [ 사용 X  ]
		$('div.row div.text-end > button:nth-child(2)').off().on('click', function() {});
		
		/// 비밃번호 재설정 다이얼로그 확인 버튼
		$('#pwModal div.text-end > button.btn-primary').off().on('click', function() {
			$('#pwModal form input').each(function( index ) {
				if ( !$( this ).val() ) {
					$(this).siblings('div').show();
				}
			});
			
			var pw = $('#pwModal form input:nth-child(1)').get(0).value;
			var pw2 = $('#pwModal form input:nth-child(1)').get(1).value;
			
			if ( !pw || pw != pw2 ) {
				alert('비밀번호가 일치하지 않습니다');
				return;
			}
			
			window.wf.fn.member.changePw(memberId, pw);
		});
	    /// 수정 버튼
		$('div.row div.text-end > button:nth-child(3)').off().on('click', function() {
			location.href = '/wf/03_001_0004.html?id=' + memberId;
		});
		/// 리스트 버튼
		$('div.row div.text-end > a.btn').off().on('click', function() {
			location.href = '/wf/03_001_0001.html';
		});
		/// 사용자 상세 정보 가져오기														 
		window.wf.fn.member.get(memberId, function(data) {
			if ( data['member'] ) {
				var grpElm = $('div.row.p-2 > div:nth-child(2)');
				$(grpElm.get(0)).text(data.member.name);
				$(grpElm.get(1)).text(data.member.id);
				$(grpElm.get(2)).text(data.member.email);
				$(grpElm.get(3)).text(data.member.tel);
				if ( data.member.role == -1 ) {
					$(grpElm.get(4)).text('관리자');
				}
				else {
					$(grpElm.get(4)).text('사용자');
				}
				$(grpElm.get(5)).text(data.member.createDt);
				$(grpElm.get(6)).text(data.member.pid);
				$(grpElm.get(7)).text(data.member.modifyDt);
				$(grpElm.get(8)).text(data.member.mid);
			}
		});
		break;
	}

	case '03_001_0004': { /* 사용자 수정 */
		/// 사용자 idx 값
		var memberId = getUrlVars()['id'];

		var oName = $('#name_form');
		var oId = $('#ID_form');
		var oEmail = $('#email_form');
		var oTel = $('#tel_form');

		oName.val('');
		oId.val('');
		oEmail.val('');
		oTel.val('');

		window.wf.fn.member.get(memberId, function(data) {
			if ( data['member'] ) {
				oName.val(data.member['name']);
				oId.val(data.member['id']);
				oEmail.val(data.member['email']);
				oTel.val(data.member['tel']);

				if ( data.member['role'] == -1 ) {
					$('input[name=formRadio1]:nth-child(0)').prop('checked', true);;
				}
				else {
					$('input[name=formRadio1]:nth-child(1)').prop('checked', true);;
				}
			}
		});

		$("input").on("propertychange change keyup paste input", function() {
			$(this).siblings('.invalid-text').hide();
		});
		
		/// 사용자 정보 수정 버튼
		$('div.text-end > button.btn-primary').off().on('click', function() {
			if ( !oId.val() ) {
				oId.siblings('.invalid-text').show();
			}
			if ( !oName.val() ) {
				oName.siblings('.invalid-text').show();
			}

			if ( $('.invalid-text:visible').length == 0 ) {
				var data = {id: oId.val(),
							name: oName.val(),
							email: oEmail.val(),
							tel: oTel.val(),
							role: (($('input[name=formRadio1]:nth-child(0):checked').length == 1) ? -1 : 1)
						   };
				window['tmp'] = data;
				window.wf.fn.member.update(memberId, data);
			}
		});
		break;
	}
	default:
		break;
	}
})();
