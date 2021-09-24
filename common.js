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
function queryJson(que) {
	var obj = window;
	var info = que.split('.');
	for (var q in info) {
		if ( obj[info[q]] ) {
			obj = obj[info[q]];
		}
		else {
			return null;
		}
	}

	return obj;
}

function setJson(que, val) {
	var obj = window;
	var info = que.split('.');
	for (var q in info) {
		if ( obj[info[q]] ) {
			obj = obj[info[q]];
		}
		else {
			if ( q == (info.length - 1) ) {
				obj[info[q]] = val;
			}
			else {
				obj[info[q]] = {};
			}
			obj = obj[info[q]];
		}
	}
	obj = val;
	
	return obj;
}

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-center",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
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
		device: {
			post: function() {
				var cfn = (arguments.length > 0) ? arguments[0] : null;
				$.post("/rest/device", {data: JSON.stringify(window['device'])},
					   function(data, status) {
						   if ( cfn ) {
							   cfn(data);
						   }
						   else {
							   if ( data.result ) {
								   location.reload(true);
							   }
							   else {
								   alert('통신에 실패하였습니다.');
							   }
						   }
					   }
					  );
			},
			xyzAxis: function(idx) {
				switch (idx) {
				case 0:
					return '';
				case 1:
					return 'axial_dirctn';
				case 2:
					return 'vertical_dirctn';
				case 3:
					return 'horizontal_dirctn';
				}
			},
			xyzAxisIdx: function(str) {
				switch (str) {
				case 'axial_dirctn':
					return 1;
				case 'vertical_dirctn':
					return 2;
				case 'horizontal_dirctn':
					return 3;
				default:
					return 0;
				}
			}
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
	/// 죄측 메뉴
	$('#side-menu ul.sub-menu:eq(0) > li > a').on('click', function(e) {
		/// 사용자 관리
		var locationUrl = '';
		switch ($(this).text().trim()) {
		case 'IoT 센서':
			locationUrl = '/wf/01_001.html';
			break;
		case '기계사양':
			locationUrl = '/wf/01_002_0002.html';
			break;
		case '결함주파수':
			locationUrl = '/wf/01_003.html';
			break;
		case '진단 임계치':
			locationUrl = '/wf/01_004.html';
			break;
		}
		location.href = locationUrl;
	});
	
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
				newSensor.find('div.dropdown-menu > a').attr('_id', sId);
				/// 센서 종류
				tbody.find('> tr:first-child > td:nth-child(2) > strong').text(( sType && sType == "iot_v" ) ? "진동": "소음");
				tbody.find('> tr:nth-child(2) > td:nth-child(2)').text(sId);
				tbody.find('> tr:nth-child(3) > td:nth-child(2)').text(sSamplerate);
				tbody.find('> tr:nth-child(4) > td:nth-child(2)').text(sPos);
				if ( sPos > 4 ) {
					tbody.find('> tr:nth-child(5)').hide();
				}
				else {
					tbody.find('> tr:nth-child(5)').show();
					$(tbody.find('> tr:nth-child(5) > td > dl > dd').get(0)).text(sX);
					$(tbody.find('> tr:nth-child(5) > td > dl > dd').get(1)).text(sY);
					$(tbody.find('> tr:nth-child(5) > td > dl > dd').get(2)).text(sZ);
				}

				listSensor.append(newSensor);
			}
		}
		else {
			listSensor.hide();
		}

		/// 등록
		var regForm = $('#sensorRegisterModal');
		regForm.find('#sensor_ID_form1').on("propertychange change keyup paste input", function() {
			$(this).removeClass('is-invalid').siblings('.invalid-text').hide();
		});

		regForm.find('input[name=formRadios]').off().on('click', function() {
			var oV = $($('#sensorRegisterModal').find('select.form-select').get(1).parentElement.parentElement.parentElement);
			var oN = $($('#sensorRegisterModal').find('select.form-select').get(4).parentElement.parentElement.parentElement);

			if ( $(this).attr('id') == 'noise_form1' ) {
				oV.hide();
				oN.show();
			}
			else {
				oV.show();
				oN.hide();
			}
		});

		regForm.find('div.text-end > button.btn-primary').off().on('click', function() {
			var rType = regForm.find('input[name=formRadios]:checked').attr('id');
			var rId = regForm.find('#sensor_ID_form1').val();
			var rSamplerate = regForm.find('#samplerate_form1').val();
			var rPos = $('#sensorRegisterModal').find('select.form-select').get(0).selectedIndex;
			var rX = $('#sensorRegisterModal').find('select.form-select').get(1).selectedIndex;
			var rY = $('#sensorRegisterModal').find('select.form-select').get(2).selectedIndex;
			var rZ = $('#sensorRegisterModal').find('select.form-select').get(3).selectedIndex;
			var rNoise = $('#sensorRegisterModal').find('select.form-select').get(4).selectedIndex;


			objList.push({
				"sensor_num" : ''+(objList.length + 1),
				"sensor_type" : ((rType == 'vibration_form1')  ? "iot_v" : "iot_n"),
				"sensor_id" : rId,
				"samplerate" : parseInt(rSamplerate),
				"sensor_pos" : ((rPos > 0) ? rPos : ((rNoise > 0) ? (rNoise + 4) : 0)),
				"x_axis": window.wf.fn.device.xyzAxis(rX),
				"y_axis": window.wf.fn.device.xyzAxis(rY),
				"z_axis": window.wf.fn.device.xyzAxis(rZ)
			});

			window.wf.fn.device.post();
			
		});

		/// 수정
		var modForm = $('#sensorEditModal');
		modForm.find('input[name=formRadios]').off().on('click', function() {
			var oV = $($('#sensorEditModal').find('select.form-select').get(1).parentElement.parentElement.parentElement);
			var oN = $($('#sensorEditModal').find('select.form-select').get(4).parentElement.parentElement.parentElement);

			if ( $(this).attr('id') == 'noise_form2' ) {
				$($('#sensorEditModal').find('select.form-select').get(4)).show()
				oV.hide();
				oN.show();
			}
			else {
				oV.show();
				oN.hide();
			}
		});
		modForm.find('div.text-end > button.btn-primary').off().on('click', function() {
			var sensorId = modForm.attr('_id');
			var obj = null;
			for ( var i = 0; i < objList.length; i++ ) {
				if ( objList[i]['sensor_id'] == sensorId ) {
					obj = objList[i];
					break;
				}
			}

			var rType = modForm.find('input[name=formRadios]:checked').attr('id');
			var rId = modForm.find('#sensor_ID_form2').val();
			var rSamplerate = modForm.find('#samplerate_form2').val();
			var rPos = modForm.find('select.form-select').get(0).selectedIndex;
			var rX = modForm.find('select.form-select').get(1).selectedIndex;
			var rY = modForm.find('select.form-select').get(2).selectedIndex;
			var rZ = modForm.find('select.form-select').get(3).selectedIndex;
			var rNoise = modForm.find('select.form-select').get(4).selectedIndex;

			obj["sensor_type"] = ((rType == 'vibration_form1')  ? "iot_v" : "iot_n");
			obj["sensor_id"] = rId;
			obj["samplerate"] = parseInt(rSamplerate);
			obj["sensor_pos"] = (rType == 'vibration_form1') ? rPos : (rNoise + 4);
			obj["x_axis"] = window.wf.fn.device.xyzAxis(rX);
			obj["y_axis"] = window.wf.fn.device.xyzAxis(rY);
			obj["z_axis"] = window.wf.fn.device.xyzAxis(rZ);
			
			window.wf.fn.device.post();
		});

		/// 삭제
		var delForm = $('#sensorDelModal');
		delForm.find('div.text-end > button.btn-danger').off().on('click', function() {
			var sensorId = delForm.attr('_id');
			for ( var i = 0; i < objList.length; i++ ) {
				if ( objList[i]['sensor_id'] == sensorId ) {
					objList.splice(i,1);
					break;
				}
			}
			//var dType = regForm.find('input[name=formRadios]:checked').attr('id');
			window.wf.fn.device.post();
		});
		
		/// 수정, 삭제 팝업이 뜰때 id을 할당
		$('div.main-content div.container-fluid div.row:nth-child(4) > div div.dropdown-menu > a').off().on('click', function() {
			var sensorId = $(this).attr('_id');

			modForm.attr('_id', sensorId);
			delForm.attr('_id', sensorId);

			var obj = null;
			for ( var i = 0; i < objList.length; i++ ) {
				if ( objList[i]['sensor_id'] == sensorId ) {
					obj = objList[i];
					break;
				}
			}

			if ( !!obj ) {
				if ( obj['sensor_type'] == 'iot_v' ) {
					modForm.find('input[name=formRadios]:eq(0)').prop('checked', true);
				}
				else {
					modForm.find('input[name=formRadios]:eq(1)').prop('checked', true);
				}

				modForm.find('#sensor_ID_form2').val(obj['sensor_id']);
				modForm.find('#samplerate_form2').val(obj['samplerate']);
				if ( obj['sensor_pos'] > 0 ) {
					var oV = $(modForm.find('select.form-select').get(1).parentElement.parentElement.parentElement);
					var oN = $(modForm.find('select.form-select').get(4).parentElement.parentElement.parentElement);

					if ( obj['sensor_pos'] > 4 ) {
						oV.hide();
						oN.show();

						$(modForm.find('select.form-select').get(0).parentElement.parentElement.parentElement).hide();
						$(modForm.find('select.form-select').get(4).parentElement.parentElement.parentElement).show().find('option:eq('+ (obj['sensor_pos'] - 4) +')').prop('selected', true);
					}
					else {
						oV.show();
						oN.hide();
						var axisX = obj['sensor_pos']
						$(modForm.find('select.form-select').get(0).parentElement.parentElement.parentElement).show();
						$(modForm.find('select.form-select').get(4).parentElement.parentElement.parentElement).hide()
						$(modForm.find('select.form-select').get(0)).show().find('option:eq('+ (obj['sensor_pos']) +')').prop('selected', true);
						
						$(modForm.find('select.form-select').get(1)).show().find('option:eq('+ window.wf.fn.device.xyzAxisIdx(obj['x_axis']) +')').prop('selected', true);
						$(modForm.find('select.form-select').get(2)).show().find('option:eq('+ window.wf.fn.device.xyzAxisIdx(obj['y_axis']) +')').prop('selected', true);
						$(modForm.find('select.form-select').get(3)).show().find('option:eq('+ window.wf.fn.device.xyzAxisIdx(obj['z_axis']) +')').prop('selected', true);
					}
				}
			}
		});

		break;
	}

	case '01_002_0001': {
		break;
	}

	case '01_002_0002': { /* 기계 사양 */
		/// 미설정 아이콘 숨김
		var dic = queryJson('device.machine_spec.spec_enable');
		for ( var k in dic ) {
			if ( dic[k] == 'enable' ) {
				switch ( k ) {
				case 'mtr_info':
					$($('a.nav-link > span').get(0)).hide();
					break;
				case 'rdc_info':
					$($('a.nav-link > span').get(1)).hide();
					break;
				case 'br_info':
					$($('a.nav-link > span').get(2)).hide();
					break;
				case 'pully_belt_info':
					$($('a.nav-link > span').get(3)).hide();
					break;
				case 'sprket_drv_chain_info':
					$($('a.nav-link > span').get(4)).hide();
					break;
				case 'st_sprket_st_chain_info':
					$($('a.nav-link > span').get(5)).hide();
					break;
				case 'blower_info':
					$($('a.nav-link > span').get(6)).hide();
					break;
				}
			}
		}

		/// 미설정값 제거
		$('table.table td').each(function( index ) {
			var span = $(this).find(' > span');
			if ( span.length > 0 ) {
				span.text('')
			}
			else {
				$(this).text('');
			}
		});

		/// 전동기 정보 값 바인딩
		var mtrInfo = queryJson('device.mtr_info');
		$('div#inFo1 table.table:eq(0) td:eq(0)').text(queryJson('device.facility_name'));
		if ( mtrInfo ) {
			$('div#inFo1 table.table:eq(0) td:eq(1)').text(mtrInfo['mtr_model']);
			$('div#inFo1 table.table:eq(0) td:eq(2) > span').text(mtrInfo['power']);
			$('div#inFo1 table.table:eq(0) td:eq(3) > span').text(mtrInfo['fl']);
			$('div#inFo1 table.table:eq(0) td:eq(4)').text(mtrInfo['efficiency']);
			$('div#inFo1 table.table:eq(0) td:eq(5) > span').text(mtrInfo['mtr_volt']);
			$('div#inFo1 table.table:eq(0) td:eq(6) > span').text(mtrInfo['rated_speed']);
			$('div#inFo1 table.table:eq(0) td:eq(7) > span').text(mtrInfo['drv_speed']);
			$('div#inFo1 table.table:eq(0) td:eq(8) > span').text(mtrInfo['drv_actual_speed']);
			$('div#inFo1 table.table:eq(0) td:eq(9) > span').text(mtrInfo['pole']);
			$('div#inFo1 table.table:eq(0) td:eq(10) > span').text(mtrInfo['rotor_bars']);
			$('div#inFo1 table.table:eq(0) td:eq(11) > span').text(mtrInfo['blades']);
			$('div#inFo1 table.table:eq(0) td:eq(12) > span').text(mtrInfo['cn']);
		}
		/// 전동기 정보 수정 버튼
		$('div#inFo1 table.table:eq(0)').prev().find('a').on('click', function() {
			if ( $(this).find('i.fa-save').length > 0 ) {
				mtrInfo['mtr_model'] = $('table.table:eq(0) td:eq(1) > input').val();
				mtrInfo['power'] = $('table.table:eq(0) td:eq(2) > span > input').val();
				mtrInfo['fl'] = $('table.table:eq(0) td:eq(3) > span > input').val();
				mtrInfo['efficiency'] = $('table.table:eq(0) td:eq(4) > input').val();
				mtrInfo['mtr_volt'] = $('table.table:eq(0) td:eq(5) > span > input').val();
				mtrInfo['rated_speed'] = $('table.table:eq(0) td:eq(6) > span > input').val();
				mtrInfo['drv_speed'] = $('table.table:eq(0) td:eq(7) > span > input').val();
				mtrInfo['drv_actual_speed'] = $('table.table:eq(0) td:eq(8) > span > input').val();
				mtrInfo['pole'] = $('table.table:eq(0) td:eq(9) > span > input').val();
				mtrInfo['rotor_bars'] = $('table.table:eq(0) td:eq(10) > span > input').val();
				mtrInfo['blades'] = $('table.table:eq(0) td:eq(11) > span > input').val();
				mtrInfo['cn'] = $('table.table:eq(0) td:eq(12) > span > input').val();

				setJson('device.machine_spec.spec_enable.mtr_info', 'enable')
				window.wf.fn.device.post(function(result) {
					toastr["success"]("저장되었습니다.")
				});
			}
		});

		/// 감속기 값 바인딩
		var rdcInfo = queryJson('device.rdc_info');
		var stgClone = $('div#inFo2 table.table:eq(1)').parent().parent().clone();
		var stgParent = $('div#inFo2 table.table:eq(1)').parent().parent().parent();
		$('div#inFo2 table.table:eq(2)').parent().parent().remove();
		$('div#inFo2 table.table:eq(1)').parent().parent().remove();

		if ( rdcInfo ) {
			$('div#inFo2 table.table:eq(0) td:eq(0)').text(rdcInfo['rdc_model']);
			$('div#inFo2 table.table:eq(0) td:eq(1) > span:eq(0)').text(rdcInfo['rdc_ratio_l']);
			$('div#inFo2 table.table:eq(0) td:eq(1) > span:eq(1)').text(rdcInfo['rdc_ratio_r']);
			$('div#inFo2 table.table:eq(0) td:eq(2)').text(rdcInfo['rdc_stg_num'] + '단');

			$.each(rdcInfo['rdc_stg_info'], function(k,o) {
				///Todo : 기본 2개를 가지고 추가하거나 빼자 조건은 rdc_stg_num
				var stgObj = stgClone.clone();
				stgObj.find('table.table td:eq(0)').text(o["rdc_stg"]);
				stgObj.find('table.table td:eq(1) > span:eq(0)').text(o["rdc_pinion_t"]);
				stgObj.find('table.table td:eq(1) > span:eq(1)').text(o["rdc_pinion_fn"]);
				stgObj.find('table.table td:eq(2) > span:eq(0)').text(o["rdc_gear_t"]);
				stgObj.find('table.table td:eq(2) > span:eq(1)').text(o["rdc_gear_fn"]);
				stgParent.append(stgObj);
			});
		}
		
		$('div#inFo2 table.table:eq(0)').prev().find('a').on('click', function() {
			if ( $(this).find('i.fa-save').length > 0 ) {
				$('div#inFo2 table.table').each(function(index, elm) {
					var item = $(elm);
					if ( index == 0 ) {
						if ( !rdcInfo ) {
							rdcInfo = setJson('device.rdc_info', {})
							rdcInfo['rdc_stg_info'] = [];
						}
						rdcInfo['rdc_model'] = item.find('td:eq(0) > input').val();
						rdcInfo['rdc_ratio_l'] = item.find('td:eq(1) > span:eq(0) > input').val();
						rdcInfo['rdc_ratio_r'] = item.find('td:eq(1) > span:eq(1) > input').val();
						rdcInfo['rdc_stg_num'] = parseInt(item.find('td:eq(2) > select').val());
					}
					else {
						var rdcStgInfo = rdcInfo['rdc_stg_info'][index - 1];
						if ( !rdcStgInfo ) {
							rdcStgInfo = {};
							rdcInfo['rdc_stg_info'][index - 1] = rdcStgInfo;
						}

						rdcStgInfo["rdc_stg"] = item.find('td:eq(0) > input').val();
						rdcStgInfo["rdc_pinion_t"] = item.find('td:eq(1) > span:eq(0) > input').val();
						rdcStgInfo["rdc_pinion_fn"] = item.find('td:eq(1) > span:eq(1) > input').val();
						rdcStgInfo["rdc_gear_t"] = item.find('td:eq(2) > span:eq(0) > input').val();
						rdcStgInfo["rdc_gear_fn"] = item.find('td:eq(2) > span:eq(1) > input').val();
					}
				});

				window.wf.fn.device.post(function(result) {
					toastr["success"]("저장되었습니다.")
				});
			}
			else {
				setTimeout(function() {
					$('div#inFo2 table.table:eq(0) td:eq(2) > select').off().on('change', function() {
						var stgNum = parseInt($(this).find('option:eq(' + this.selectedIndex + ')').text());
						for ( var i = 0; i < stgNum; i++ ) {
							var j = i + 1;
							var obj = $('div#inFo2 table.table:eq(' + j + ')');
							if ( obj.length == 0 ) {
								var stgObj = stgClone.clone();
								stgObj.find('table.table td:eq(0) > input').val('');
								stgObj.find('table.table td:eq(1) > span:eq(0) > input').val('');
								stgObj.find('table.table td:eq(1) > span:eq(1) > input').val('');
								stgObj.find('table.table td:eq(2) > span:eq(0) > input').val('');
								stgObj.find('table.table td:eq(2) > span:eq(1) > input').val('');
								stgParent.append(stgObj);
							}
						}

						while ( stgNum < ($('div#inFo2 table.table').length - 1) ) {
							$('div#inFo2 table.table:eq(' + (stgNum + 1) + ')').parent().parent().remove();
						}
					});
				}, 500);
			}
		});

		/// 베어링 값 바인딩
		var brInfo = queryJson('device.br_info');
		var brClone = $('div#inFo3 table.table:eq(1)').parent().parent().clone();
		var brParent = $('div#inFo3 table.table:eq(1)').parent().parent().parent();
		$('div#inFo3 table.table:eq(3)').parent().parent().remove();
		$('div#inFo3 table.table:eq(2)').parent().parent().remove();
		$('div#inFo3 table.table:eq(1)').parent().parent().remove();

		if ( brInfo ) {
			$('div#inFo3 table.table:eq(0) td:eq(0)').text(brInfo['name_of_br']);
			$('div#inFo3 table.table:eq(0) td:eq(1)').text(brInfo['num_of_br']);

			$.each(brInfo['br_detail_info'], function(k,v) {
				var brObj = brClone.clone();
				var idx = (k + 1);
				brClone.find('td:eq(0)').text(v['br_pos']);
				brClone.find('td:eq(1) > span').text(v['br_nn']);
				brClone.find('td:eq(2) > span').text(v['br_bd']);
				brClone.find('td:eq(3) > span').text(v['br_pd']);
				brClone.find('td:eq(4) > span').text(v['br_contact_angl']);
				brClone.find('td:eq(5) > span').text(v['br_fn']);

				brParent.append(brObj);
			});
		}

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

/*

test code region

*/
