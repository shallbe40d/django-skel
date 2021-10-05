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
			if ( q == (info.length - 1) ) {
				obj[info[q]] = val;
				obj = obj[info[q]];
			}
			else {
				obj = obj[info[q]];
			}
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
		chart: function(chart_id, chart_data, startTime, timeInterval) {
			startTime = 16094232; 
			timeInterval = 100000;
			var data = [];
			for ( var i = 0; i < chart_data.length; i++ ) {
				data[i] = [((startTime + i) * timeInterval), parseInt(chart_data[i])];
			}
			Highcharts.chart('sensorChart1', {
				chart: {
					zoomType: 'x',
					backgroundColor: 'transparent'
				},
				title: {
					text: ''
				},
				subtitle: {
					text: ''
				},
				navigation: {
					buttonOptions: {
						enabled: false
					}
				},
				legend: {
					enabled: false
				},
				tooltip: {
					valueDecimals: 2
				},
				xAxis: {
					type: 'datetime'
				},
				yAxis: {
					title: {
						text: ''
					}
				},
				series: [{
					data: data,
					lineWidth: 1.0,
					name: '',
					color: 'rgba(80,165,241,0.5)'
				}]

			});
		},
		device: {
			post: function() {
				var cfn = (arguments.length > 0) ? arguments[0] : null;
				var subp = (arguments.length > 1) ? arguments[1] : null;
				var postData = {data: JSON.stringify(window['device'])};
				if ( subp ) {
					postData['subp'] = JSON.stringify(subp);
				}

				$.post("/rest/device", postData,
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
					   location.reload(true);
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
	$('#page-topbar .navbar-header a.dropdown-item').on('click', function(e) {
		/// 사용자 관리
		switch ($(this).text().trim() ) {
		case '사용자 관리':
			location.href = '/wf/03_001_0001.html';
			break;
		case '시스템 설정':
			location.href = '/wf/03_002.html';
			break;
		case '보안 설정':
			location.href = '/wf/03_003.html';
			break;
		case '진단 설정':
			location.href = '/wf/03_004.html';
			break;
		case '시스템 초기화':
			location.href = '/wf/03_005.html';
			break;
		case '로그아웃':
			window.wf.fn.logout();
			break;
		default:
			break;
		}
	});

	/// 좌측 메뉴 열림 상태 유지
	setTimeout(function() {
		switch (window.path.substr(0,2)) {
		case '01':
			//$('#side-menu ul.sub-menu:eq(0)').prev().tab('show');
			break;
		case '02':
			//$('#side-menu ul.sub-menu:eq(1)').prev().tab('show');
			break;
		default:
			break;
		}
	}, 1000);

	/// 죄측 메뉴
	$('#side-menu li > a:eq(0)').on('click', function(e) {
		location.href = '/wf/00_000.html';
	});
	$('#side-menu ul.sub-menu > li > a').on('click', function(e) {
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

		case '설비가동여부':
			locationUrl = '/wf/02_001.html';
			break;
		case '센서별 시간파형':
			locationUrl = '/wf/02_002.html';
			break;
		case '센서별 FFT':
			locationUrl = '/wf/02_003.html';
			break;
		case '센서별 진동등급':
			locationUrl = '/wf/02_004.html';
			break;
		case '결함진단':
			locationUrl = '/wf/02_005.html';
			break;
		case '신율/전달효율':
			locationUrl = '/wf/02_006.html';
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

			window.wf.fn.device.post(function(result) {
				toastr["success"]("저장되었습니다.")
			});
			
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
			
			window.wf.fn.device.post(function(result) {
				toastr["success"]("저장되었습니다.")
			});
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
			window.wf.fn.device.post(function(result) {
				toastr["success"]("저장되었습니다.")
			});
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

	case '01_002_0001': { /* 기계설비 정보 수정 */
		var dic = queryJson('device.machine_spec.spec_enable');
		$($('input[name=formRadio1]').get(0)).prop('checked', true);
		$($('input[name=formRadio2]').get(0)).prop('checked', true);
		$($('input[name=formRadio3]').get(0)).prop('checked', true);
		$($('input[name=formRadio4]').get(0)).prop('checked', true);
		$($('input[name=formRadio5]').get(0)).prop('checked', true);
		$($('input[name=formRadio6]').get(0)).prop('checked', true);
		$($('input[name=formRadio7]').get(0)).prop('checked', true);
	
		for ( var k in dic ) {
			if ( dic[k] == 'enable' ) {
				switch ( k ) {
				case 'mtr_info':
					$($('input[name=formRadio1]').get(1)).prop('checked', true);
					break;
				case 'rdc_info':
					$($('input[name=formRadio2]').get(1)).prop('checked', true);
					break;
				case 'br_info':
					$($('input[name=formRadio3]').get(1)).prop('checked', true);
					break;
				case 'pully_belt_info':
					$($('input[name=formRadio4]').get(1)).prop('checked', true);
					break;
				case 'sprket_drv_chain_info':
					$($('input[name=formRadio5]').get(1)).prop('checked', true);
					break;
				case 'st_sprket_st_chain_info':
					$($('input[name=formRadio6]').get(1)).prop('checked', true);
					break;
				case 'blower_info':
					$($('input[name=formRadio7]').get(1)).prop('checked', true);
					break;
				}
			}
		}

		$('#saveModal .modal-footer > button.btn-success').off().on('click', function() {
			dic['mtr_info'] = $($('input[name=formRadio1]').get(0)).prop('checked') ? 'disable': 'enable';
			dic['rdc_info'] = $($('input[name=formRadio2]').get(0)).prop('checked') ? 'disable': 'enable';
			dic['br_info'] = $($('input[name=formRadio3]').get(0)).prop('checked') ? 'disable': 'enable';
			dic['pully_belt_info'] = $($('input[name=formRadio4]').get(0)).prop('checked') ? 'disable': 'enable';
			dic['sprket_drv_chain_info'] = $($('input[name=formRadio5]').get(0)).prop('checked') ? 'disable': 'enable';
			dic['st_sprket_st_chain_info'] = $($('input[name=formRadio6]').get(0)).prop('checked') ? 'disable': 'enable';
			dic['blower_info'] = $($('input[name=formRadio7]').get(0)).prop('checked') ? 'disable': 'enable';

			window.wf.fn.device.post(function(result) {
				toastr["success"]("저장되었습니다.")
				$('#saveModal').modal('hide');
			});
		});
		break;
	}

	case '01_002_0002': { /* 기계 사양 */
		$('button.btn.btn-secondary').off().on('click', function() {
			location.href = '/wf/01_002_0001.html';
		});
		
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
		var mtrInfo = queryJson('device.machine_spec.mtr_info');
		$('div#inFo1 table.table:eq(0) td:eq(0)').text(queryJson('device.machine_spec.facility_name'));
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
		var rdcInfo = queryJson('device.machine_spec.rdc_info');
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
							rdcInfo = setJson('device.machine_spec.rdc_info', {})
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
		var brInfo = queryJson('device.machine_spec.br_info');
		var brClone = $('div#inFo3 table.table:eq(1)').parent().parent().clone();
		var brParent = $('div#inFo3 table.table:eq(1)').parent().parent().parent();
		$('div#inFo3 table.table:eq(3)').parent().parent().remove();
		$('div#inFo3 table.table:eq(2)').parent().parent().remove();
		$('div#inFo3 table.table:eq(1)').parent().parent().remove();

		/// 베어링 값 저장
		$('div#inFo3 table.table:eq(0)').prev().find('a').on('click', function() {
			if ( $(this).find('i.fa-save').length > 0 ) {
				var modelName = '';
				$('div#inFo3 table.table').each(function(index, elm) {
					var item = $(elm);
					if ( index == 0 ) {
						if ( !brInfo ) {
							brInfo = setJson('device.machine_spec.br_info', {})
							brInfo['br_detail_info'] = [];
							brInfo['num_of_br'] = 0;
						}
						modelName = $('div#inFo3 table.table:eq(0) td:eq(0) > input').val();

					}
					else {
						var brDetailInfo = brInfo['br_detail_info'][index - 1];
						if ( !brDetailInfo ) {
							brDetailInfo = {};
							brInfo['br_detail_info'][index - 1] = brDetailInfo;
						}

						brDetailInfo["br_model"] = modelName;
						brDetailInfo["br_pos"] = item.find('td:eq(0) > select').val().match(/\([^)]*\)/)[0].substr(1).replace(/\)/, '');
						brDetailInfo["br_pos_name"] = item.find('td:eq(0) > select').val();
						brDetailInfo["br_nn"] = item.find('td:eq(1) > span > input').val();
						brDetailInfo["br_bd"] = item.find('td:eq(2) > span > input').val();
						brDetailInfo["br_pd"] = item.find('td:eq(3) > span > input').val();
						brDetailInfo["br_contact_angl"] = item.find('td:eq(4) > span > input').val();
						brDetailInfo["br_fn"] = item.find('td:eq(5) > span > input').val();
					}
				});

				window.wf.fn.device.post(function(result) {
					toastr["success"]("저장되었습니다.")
				});
			}
		});
		/// 베아링 추가 버튼
		$('div#inFo3 button.btn-success').off().on('click', function() {
			if ( $('div#inFo3 table.table:eq(0)').prev().find('a > i.fa-save').length > 0 ) {
				$('div#inFo3 table.table:eq(0)').prev().find('a').click();
			}
			
			var brObj = brClone.clone();
			brObj.find('td:eq(0)').text('');
			brObj.find('td:eq(1) > span').text('');
			brObj.find('td:eq(2) > span').text('');
			brObj.find('td:eq(3) > span').text('');
			brObj.find('td:eq(4) > span').text('');
			brObj.find('td:eq(5) > span').text('');

			brObj.find('div.text-end > button').off().on('click', function() {
				brObj.remove();
			});
			brParent.append(brObj);

			$('div#inFo3 table.table:eq(0)').prev().find('a').click();
		});

		if ( brInfo ) {
			$('div#inFo3 table.table:eq(0) td:eq(1)').text(brInfo['num_of_br']);

			$.each(brInfo['br_detail_info'], function(k,v) {
				$('div#inFo3 table.table:eq(0) td:eq(0)').text(v['br_model']);
				var brObj = brClone.clone();
				brObj.attr('idx', k);
				brObj.find('td:eq(0)').text(v['br_pos_name']);
				brObj.find('td:eq(1) > span').text(v['br_nn']);
				brObj.find('td:eq(2) > span').text(v['br_bd']);
				brObj.find('td:eq(3) > span').text(v['br_pd']);
				brObj.find('td:eq(4) > span').text(v['br_contact_angl']);
				brObj.find('td:eq(5) > span').text(v['br_fn']);

				/// 베아링 제거 버튼
				brObj.find('div.text-end > button').off().on('click', function() {
					brInfo['br_detail_info'].splice(brObj.attr('idx'),1);
					brObj.remove();

					window.wf.fn.device.post(function(result) {
						toastr["success"]("삭제되었습니다.")
					});
				});
				brParent.append(brObj);
			});
		}

		/// 풀리 및 V-벨트 정보 값 바인딩
		var beltInfo = queryJson('device.machine_spec.pully_belt_info');
		
		if ( beltInfo ) {
			$('div#inFo4 table.table:eq(0) td:eq(0)').text(beltInfo['drv_pulley_model']);
			$('div#inFo4 table.table:eq(0) td:eq(1)').text(beltInfo['belt_model']);
			$('div#inFo4 table.table:eq(0) td:eq(2) > span').text(beltInfo['drv_pully_pcd']);
			$('div#inFo4 table.table:eq(0) td:eq(3) > span').text(beltInfo['drvn_pully_pcd']);
			$('div#inFo4 table.table:eq(0) td:eq(4) > span').text(beltInfo['belt_length']);
			$('div#inFo4 table.table:eq(0) td:eq(5) > span').text(beltInfo['belt_fn']);
			$('div#inFo4 table.table:eq(0) td:eq(6) > span').text(beltInfo['dist_pullys']);
		}
		/// 풀리 및 V-벨트 정보 수정 
		$('div#inFo4 table.table:eq(0)').prev().find('a').on('click', function() {
			if ( $(this).find('i.fa-save').length > 0 ) {

				beltInfo['drv_pulley_model'] = $('div#inFo4 table.table:eq(0) td:eq(0) > input').val();
				beltInfo['belt_model'] = $('div#inFo4 table.table:eq(0) td:eq(1) > input').val();
				beltInfo['drv_pully_pcd'] = $('div#inFo4 table.table:eq(0) td:eq(2) > span > input').val();
				beltInfo['drvn_pully_pcd'] = $('div#inFo4 table.table:eq(0) td:eq(3) > span > input').val();
				beltInfo['belt_length'] = $('div#inFo4 table.table:eq(0) td:eq(4) > span > input').val();
				beltInfo['belt_fn'] = $('div#inFo4 table.table:eq(0) td:eq(5) > span > input').val();
				beltInfo['dist_pullys'] = $('div#inFo4 table.table:eq(0) td:eq(6) > span > input').val();

				window.wf.fn.device.post(function(result) {
					toastr["success"]("저장되었습니다.")
				});
			}
		});

		/// 구동/피구동 스프라켓 및 구동체인 정보 값 바인딩
		var sprketInfo = queryJson('device.machine_spec.sprket_drv_chain_info');
		
		if ( sprketInfo ) {
			$('div#inFo5 table.table:eq(0) td:eq(0)').text(sprketInfo['drv_sprket_model']);
			$('div#inFo5 table.table:eq(0) td:eq(1)').text(sprketInfo['drv_chain_model']);
			$('div#inFo5 table.table:eq(0) td:eq(2) > span').text(sprketInfo['drv_sprket_t']);
			$('div#inFo5 table.table:eq(0) td:eq(3) > span').text(sprketInfo['drv_sprket_pcd']);
			$('div#inFo5 table.table:eq(0) td:eq(4) > span').text(sprketInfo['drvn_sprket_t']);
			$('div#inFo5 table.table:eq(0) td:eq(5) > span').text(sprketInfo['drvn_sprket_pcd']);
			$('div#inFo5 table.table:eq(0) td:eq(6) > span').text(sprketInfo['drv_chain_link_n']);
			$('div#inFo5 table.table:eq(0) td:eq(7) > span').text(sprketInfo['drv_chain_pitch']);
		}
		
		$('div#inFo5 table.table:eq(0)').prev().find('a').on('click', function() {
			if ( $(this).find('i.fa-save').length > 0 ) {
				sprketInfo['drv_sprket_model'] = $('div#inFo5 table.table:eq(0) td:eq(0) > input').val();
				sprketInfo['drv_chain_model'] = $('div#inFo5 table.table:eq(0) td:eq(1) > input').val();
				sprketInfo['drv_sprket_t'] = $('div#inFo5 table.table:eq(0) td:eq(2) > span > input').val();
				sprketInfo['drv_sprket_pcd'] = $('div#inFo5 table.table:eq(0) td:eq(3) > span > input').val();
				sprketInfo['drvn_sprket_t'] = $('div#inFo5 table.table:eq(0) td:eq(4) > span > input').val();
				sprketInfo['drvn_sprket_pcd'] = $('div#inFo5 table.table:eq(0) td:eq(5) > span > input').val();
				sprketInfo['drv_chain_link_n'] = $('div#inFo5 table.table:eq(0) td:eq(6) > span > input').val();
				sprketInfo['drv_chain_pitch'] = $('div#inFo5 table.table:eq(0) td:eq(7) > span > input').val();

				window.wf.fn.device.post(function(result) {
					toastr["success"]("저장되었습니다.")
				});
			}
		});

		/// 스텝체인 스프라켓 및 스텝체인 정보 값 바인딩
		var stSprketInfo = queryJson('device.machine_spec.st_sprket_st_chain_info');
		
		if ( stSprketInfo ) {
			$('div#inFo6 table.table:eq(0) td:eq(0) > span').text(stSprketInfo['stc_sprket_t']);
			$('div#inFo6 table.table:eq(0) td:eq(1) > span').text(stSprketInfo['stc_sprket_pcd']);
			$('div#inFo6 table.table:eq(0) td:eq(2) > span').text(stSprketInfo['st_chain_link_n']);
			$('div#inFo6 table.table:eq(0) td:eq(3) > span').text(stSprketInfo['st_chain_pitch']);
			$('div#inFo6 table.table:eq(0) td:eq(4) > span').text(stSprketInfo['st_chain_step_n']);
			$('div#inFo6 table.table:eq(0) td:eq(5)').text(stSprketInfo['st_chain_r_material_name']);
		}
		
		$('div#inFo6 table.table:eq(0)').prev().find('a').on('click', function() {
			if ( $(this).find('i.fa-save').length > 0 ) {

				stSprketInfo['stc_sprket_t'] = $('div#inFo6 table.table:eq(0) td:eq(0) > span > input').val();
				stSprketInfo['stc_sprket_pcd'] = $('div#inFo6 table.table:eq(0) td:eq(1) > span > input').val();
				stSprketInfo['st_chain_link_n'] = $('div#inFo6 table.table:eq(0) td:eq(2) > span > input').val();
				stSprketInfo['st_chain_pitch'] = $('div#inFo6 table.table:eq(0) td:eq(3) > span > input').val();
				stSprketInfo['st_chain_step_n'] = $('div#inFo6 table.table:eq(0) td:eq(4) > span > input').val();
				stSprketInfo['st_chain_r_material_name'] = $('div#inFo6 table.table:eq(0) td:eq(5) > select').val();

				stSprketInfo['st_chain_r_material'] = (stSprketInfo['st_chain_r_material_name'] == '우레탄') ? 'U' : 'ST';
				window.wf.fn.device.post(function(result) {
					toastr["success"]("저장되었습니다.")
				});
			}
		});

		/// 송풍기 정보 값 바인딩
		var blowerInfo = queryJson('device.machine_spec.blower_info');
		
		if ( blowerInfo ) {
			$('div#inFo7 table.table:eq(0) td:eq(0)').text(blowerInfo['blw_model']);
			$('div#inFo7 table.table:eq(0) td:eq(1) > span').text(blowerInfo['blw_fan_n']);
		}
		
		$('div#inFo7 table.table:eq(0)').prev().find('a').on('click', function() {
			if ( $(this).find('i.fa-save').length > 0 ) {

				blowerInfo['blw_model'] = $('div#inFo7 table.table:eq(0) td:eq(0) > input').val();
				blowerInfo['blw_fan_n'] = $('div#inFo7 table.table:eq(0) td:eq(1) > span > input').val();

				window.wf.fn.device.post(function(result) {
					toastr["success"]("저장되었습니다.")
				});
			}
		});

		break;
	}

	case '01_003': { /* 결함 주파수 */
		var faultFreq = queryJson('device.fault_freq.fault_freq_enable');
		if ( faultFreq['mtr_fault_freq'] != 'enable') {
			$('div.row a.nav-link:eq(0)').hide();
		}
		if ( faultFreq['rdc_fault_freq'] != 'enable') {
			$('div.row a.nav-link:eq(1)').hide();
		}
		if ( faultFreq['br_fault_freq'] != 'enable') {
			$('div.row a.nav-link:eq(2)').hide();
		}
		if ( faultFreq['plly_belt_fault_freq'] != 'enable') {
			$('div.row a.nav-link:eq(3)').hide();
		}
		if ( faultFreq['drv_sprket_fault_freq'] != 'enable') {
			$('div.row a.nav-link:eq(4)').hide();
		}
		if ( faultFreq['blower_fault_freq'] != 'enable') {
			$('div.row a.nav-link:eq(5)').hide();
		}

		/// 전동기 결함
		var mtrFault = queryJson('device.fault_freq.mtr_fault_freq');
		if (mtrFault) {
			$('#freQuency1 table.table td:eq(0)').text(mtrFault['ns_rpm'] + ' rpm');
			$('#freQuency1 table.table td:eq(1)').text(mtrFault['ns'] + ' Hz');
			$('#freQuency1 table.table td:eq(2)').text(mtrFault['fr'] + ' Hz');
			$('#freQuency1 table.table td:eq(3)').text(mtrFault['fs'] + ' Hz');
			$('#freQuency1 table.table td:eq(4)').text(mtrFault['fp'] + ' Hz');
			$('#freQuency1 table.table td:eq(5)').text(mtrFault['rbpf'] + ' Hz');
			$('#freQuency1 table.table td:eq(6)').text(mtrFault['bpf'] + ' Hz');
			$('#freQuency1 table.table td:eq(7)').text(mtrFault['cpf'] + ' Hz');
			$('#freQuency1 table.table td:eq(8)').text('');
			$('#freQuency1 table.table td:eq(9)').text('');
		}

		/// 감속기 결함
		var rdcFault = queryJson('device.fault_freq.rdc_fault_freq');
		var rdcRow = $('#freQuency2 tbody tr:eq(0)').clone();
		var rdcBody = $('#freQuency2 tbody').empty();

		if (rdcFault) {
			$.each(rdcFault, function(k,v) {
				var rdcObj = rdcRow.clone();
				rdcObj.find('td:eq(0)').text(v['rdc_stg']);
				rdcObj.find('td:eq(1)').text(v['rdc_stg_gmf']);
				rdcObj.find('td:eq(2)').text(v['rdc_fr']);
				rdcObj.find('td:eq(3)').text(v['rdc_fht']);
				rdcBody.append(rdcObj);
			});
		}

		/// 베어링 결함
		var brFault = queryJson('device.fault_freq.br_fault_freq');
		var brRow = $('#freQuency3 tbody tr:eq(0)').clone();
		var brBody = $('#freQuency3 tbody').empty();

		if (brFault) {
			$.each(brFault, function(k,v) {
				var obj = brRow.clone();
				obj.find('td:eq(0)').text(v['br_pos']);
				obj.find('td:eq(1)').text(v['br_fn']);
				obj.find('td:eq(2)').text(v['bpfi']);
				obj.find('td:eq(3)').text(v['bpfo']);
				obj.find('td:eq(4)').text(v['bsf']);
				obj.find('td:eq(5)').text(v['ftf']);
				brBody.append(obj);
			});
		}

		/// 폴리 및 V-벨트 결함
		var veltFault = queryJson('device.fault_freq.plly_belt_fault_freq');

		if (veltFault) {
			$('#freQuency4 tbody td:eq(0)').text(veltFault['drvn_fr'] + ' Hz');
			$('#freQuency4 tbody td:eq(1)').text(veltFault['vbelt_f'] + ' Hz');
		}

		/// 구동/피구동 스프라켓 및 구동체 결함
		var sprketFault = queryJson('device.fault_freq.drv_sprket_fault_freq');

		if (sprketFault) {
			$('#freQuency5 tbody td:eq(0)').text(sprketFault['drvn_fr'] + ' Hz');
			$('#freQuency5 tbody td:eq(1)').text(sprketFault['drv_sprket_gmf'] + ' Hz');
		}
		
		/// 송풍기 결함
		var blowerFault = queryJson('device.fault_freq.blower_fault_freq');

		if (blowerFault) {
			$('#freQuency6 tbody td:eq(0)').text(blowerFault['blw_fan_f'] + ' Hz');
		}
		
		setTimeout(function() {
			$('div.row a.nav-link:visible:eq(0)').tab('show');
		}, 500);
		break;
	}
		
	case '02_002': {
		var sensorChar = 'v';
		var chartData = null;
		var vFiles = [];
		var nFiles = [];
		$.get("/rest/chart/list", {},
			  function(data, status) {
				  chartData = data;
				  window.wf.fn.chart('sensorChart1', chartData['x'], 0, 0);

				  var fileList = chartData['list'];
				  /// ICTR01_3_V_210618152300.num
				  $('#sensor-ID1 option:eq(0)').text(chartData['file']);
				  var fileInfo = chartData['file'].match(/_(\d{12})\.num/);
				  if ( fileInfo.length > 1) {
					  var m = fileInfo[1];
					  $('#senSor1 div.float-end').text('측정 시점 : ' + m.substr(0,4) + '/' + m.substr(4,2) + '/' + m.substr(6,2) + ' ' + m.substr(8,2) + ':' + m.substr(10,2)  );
				  }
				  /// list
				  var cloneNode = $('#sensorList1 tbody > tr:eq(0)').clone();
				  $('#sensorList1 tbody > tr').remove();
				  for ( var i = 0; i < fileList.length; i++ ) {
					  var fileNode = cloneNode.clone();
					  fileNode.hide();
					  var fileName = fileList[i].substr(fileList[i].lastIndexOf('/') + 1);
					  var fileInfo = fileName.match(/_(\d{12})\.num/);
					  if ( fileInfo.length > 1) {
						  var m = fileInfo[1];
						  fileNode.find('> td:eq(1)').text(m.substr(0,4) + '/' + m.substr(4,2) + '/' + m.substr(6,2) + ' ' + m.substr(8,2) + ':' + m.substr(10,2));
					  }
					  fileNode.find('> td:eq(2)').text(fileName);
					  
					  if ( fileList[i].indexOf('_V_') == -1 ) {
						  nFiles.push(fileList[i]);
						  fileNode.addClass('n');
					  }
					  else {
						  vFiles.push(fileList[i]);
						  fileNode.addClass('v');
					  }
					  $('#sensorList1 tbody').append(fileNode);
				  }

				  $('li.nav-item:eq(0) > a > span').text('진동 센서 ( ' + vFiles.length + ')');
				  $('li.nav-item:eq(1) > a > span').text('소음 센서 ( ' + nFiles.length + ')');
				  $('#sensorList1 tbody > tr.v').show();
			  }
			 );
		$('input[name=formRadio1]').off().on('click', function() {
			var typeChar = 'x';
			switch ( $('input[name=formRadio1]').index(this) ) {
			case 0:
				typeChar = 'x';
				break;
			case 1:
				typeChar = 'y';
				break;
			case 2:
				typeChar = 'z';
				break;
			}

			window.wf.fn.chart('sensorChart1', chartData[typeChar], 0, 0);
		});
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

	case '03_002': { /* 시스템 설정 */
		/// ip 설정
		$('#seT1 > div.card').hide();
		$('#seT1 > div.card:eq(2)').show();
		$.get("/rest/net_info", {},
			  function(data, status) {
				  $('#seT1 > div.card:eq(2) tbody td:eq(0)').text(data['ip']['addr']);
				  $('#seT1 > div.card:eq(2) tbody td:eq(1)').text(data['ip']['netmask']);
				  $('#seT1 > div.card:eq(2) tbody td:eq(2)').text(data['gateway']);
				  $('#seT1 > div.card:eq(2) tbody td:eq(3)').text(data['dns'][0]);
				  $('#seT1 > div.card:eq(2) tbody td:eq(4)').text(data['dns'][1]);
			  }
			 );

		/// ssh 설정
		var ssh = queryJson('device.system.ssh') || '허용하지 않습니다.';
		setJson('device.system.ssh', ssh);

		$('#seT2 td:eq(0)').text(ssh);
		$('#seT2 div > a.edit').off().on('click', function() {
			if ( $(this).find('i.fa-save').length > 0 ) {
				setJson('device.system.ssh', $('#seT2 td:eq(0) > select').val());
				var subp = {'type': 'sshTemp', 'val': false};
				if ( $('#seT2 td:eq(0) > select').val() == '허용합니다.' ) {
					subp['val'] = 'true';
				}
				window.wf.fn.device.post(function(result) {
					toastr["success"]("저장되었습니다.")
				}, subp);
			}
		});
		
		/// network time 설정
		var ntp = queryJson('device.system.ntp') || '허용하지 않습니다.';
		setJson('device.system.ntp', ntp);

		$('#seT3 td:eq(0)').text(ntp);
		$('#seT3 div > a.edit').off().on('click', function() {
			if ( $(this).find('i.fa-save').length > 0 ) {
				setJson('device.system.ntp', $('#seT3 td:eq(0) > select').val());
				var subp = {'type': 'ntp', 'val': false};
				if ( $('#seT3 td:eq(0) > select').val() == '허용합니다.' ) {
					subp['val'] = 'true';
				}
				window.wf.fn.device.post(function(result) {
					toastr["success"]("저장되었습니다.")
				}, subp);
			}
		});
		
		/// locale 설정
		var locale = queryJson('device.system.locale') || '(UTC+09:00) Seoul';
		setJson('device.system.locale', locale);

		$('#seT4 td:eq(0)').text(locale);
		$('#seT4 div > a.edit').off().on('click', function() {
			if ( $(this).find('i.fa-save').length > 0 ) {
				var localeVar = $('#seT4 td:eq(0) > select').val();
				setJson('device.system.locale', localeVar);
				//var subp = {'type': 'locale', 'val': localeVar};
				var subp = {'type': 'locale', 'val': 'Asia/Seoul'};
				window.wf.fn.device.post(function(result) {
					toastr["success"]("저장되었습니다.")
				}, subp);
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

