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
function timestamp() {
	var today = new Date();
	today.setHours(today.getHours() + 9);
	return today.toISOString().replace('T', ' ').substring(0, 19);
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
							   alert('???????????? ????????? ?????????????????????.');
						   }
					   }
					  );
			}
			else {
				alert('?????? ??????????????? ?????? ??????????????? ???????????? ????????????.');
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
		chartFFT: function(chart_data, startTime, timeInterval) {
			startTime = 16094232; 
			timeInterval = 100000;
			var data = [];
			for ( var i = 0; i < chart_data.length; i++ ) {
				data[i] = [((startTime + i) * timeInterval), parseFloat(chart_data[i])];
			}
			Highcharts.chart('failChart', {
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
				xAxis: {
					type: 'datetime'
				},
				yAxis: {
					title: {
						text: ''
					}
				},
				legend: {
					enabled: false
				},
				plotOptions: {
					series: {
						fillOpacity: 0.15
					},
					area: {
						marker: {
							radius: 2
						},
						lineWidth: 1,
						states: {
							hover: {
								lineWidth: 1
							}
						},
						threshold: null
					}
				},

				series: [{
					type: 'area',
					name: '',
					data: data,
					color: 'rgba(80,165,241,1)'
				}]
			});
		},
		getChart: function(fileName, callback) {
			
			$.get("/rest/chart", {file: fileName},
				  function(data, status) {
					  callback(data);
				  }
				 );
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
								   alert('????????? ?????????????????????.');
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
					alert('??????????????? ????????? ??????????????? ???????????? ????????????');
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
						   alert('??????????????? ?????????????????????.');
					   }
					   else {
						   alert('????????? ????????? ???????????? ????????????.');
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
						   alert('??????????????? ?????????????????????.');
					   }
					   else {
						   alert('????????? ????????? ???????????? ????????????.');
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
						   alert('????????? ????????? ???????????? ????????????.');
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
	var diag_threshold = queryJson('device.diag_threshold');
	var diag_th_enable = diag_threshold['diag_th_enable'];
	if ( diag_th_enable != "enable") {
		$('#notSetModal').modal('show');
	}
	$('#notSetModal div.modal-footer > a.btn-primary').off().on('click', function() {
		location.href = '/wf/01_004.html';
	});

	/// ?????? ??????
	$('#page-topbar .navbar-header a.dropdown-item').on('click', function(e) {
		/// ????????? ??????
		switch ($(this).text().trim() ) {
		case '????????? ??????':
			location.href = '/wf/03_001_0001.html';
			break;
		case '????????? ??????':
			location.href = '/wf/03_002.html';
			break;
		case '?????? ??????':
			location.href = '/wf/03_003.html';
			break;
		case '?????? ??????':
			location.href = '/wf/03_004.html';
			break;
		case '????????? ?????????':
			location.href = '/wf/03_005.html';
			break;
		case '????????????':
			window.wf.fn.logout();
			break;
		default:
			break;
		}
	});

	/// ?????? ?????? ?????? ?????? ??????
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

	/// ?????? ??????
	$('#side-menu li > a:eq(0)').on('click', function(e) {
		location.href = '/wf/00_000.html';
	});
	$('#side-menu ul.sub-menu > li > a').on('click', function(e) {
		/// ????????? ??????
		var locationUrl = '';
		switch ($(this).text().trim()) {
		case 'IoT ??????':
			locationUrl = '/wf/01_001.html';
			break;
		case '????????????':
			locationUrl = '/wf/01_002_0002.html';
			break;
		case '???????????????':
			locationUrl = '/wf/01_003.html';
			break;
		case '?????? ?????????':
			locationUrl = '/wf/01_004.html';
			break;

		case '??????????????????':
			locationUrl = '/wf/02_001.html';
			break;
		case '????????? ????????????':
			locationUrl = '/wf/02_002.html';
			break;
		case '????????? FFT':
			locationUrl = '/wf/02_003.html';
			break;
		case '????????? ????????????':
			locationUrl = '/wf/02_004.html';
			break;
		case '????????????':
			locationUrl = '/wf/02_005.html';
			break;
		case '??????/????????????':
			locationUrl = '/wf/02_006.html';
			break;
		}
		location.href = locationUrl;
	});
	
	switch (window.path) {
	case '00_001': { /* ????????? ?????????login page */
		$('form').off().on('submit', window.wf.fn.login);
		break;
	}

	case '00_002': { /* ?????? ????????? ??? ???????????? ?????? */
		$('form').off().on('submit', window.wf.fn.changePasswd); 
		break;
	}

	case '01_001': { /* IoT ?????? */
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
				/// ?????? ??????
				tbody.find('> tr:first-child > td:nth-child(2) > strong').text(( sType && sType == "iot_v" ) ? "??????": "??????");
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

		/// ??????
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
				toastr["success"]("?????????????????????.")
			});
			
		});

		/// ??????
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
				toastr["success"]("?????????????????????.")
			});
		});

		/// ??????
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
				toastr["success"]("?????????????????????.")
			});
		});
		
		/// ??????, ?????? ????????? ?????? id??? ??????
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

	case '01_002_0001': { /* ???????????? ?????? ?????? */
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
				toastr["success"]("?????????????????????.")
				$('#saveModal').modal('hide');
			});
		});
		break;
	}

	case '01_002_0002': { /* ?????? ?????? */
		$('button.btn.btn-secondary').off().on('click', function() {
			location.href = '/wf/01_002_0001.html';
		});
		
		/// ????????? ????????? ??????
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

		/// ???????????? ??????
		$('table.table td').each(function( index ) {
			var span = $(this).find(' > span');
			if ( span.length > 0 ) {
				span.text('')
			}
			else {
				$(this).text('');
			}
		});

		/// ????????? ?????? ??? ?????????
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
		/// ????????? ?????? ?????? ??????
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
					toastr["success"]("?????????????????????.")
				});
			}
		});

		/// ????????? ??? ?????????
		var rdcInfo = queryJson('device.machine_spec.rdc_info');
		var stgClone = $('div#inFo2 table.table:eq(1)').parent().parent().clone();
		var stgParent = $('div#inFo2 table.table:eq(1)').parent().parent().parent();
		$('div#inFo2 table.table:eq(2)').parent().parent().remove();
		$('div#inFo2 table.table:eq(1)').parent().parent().remove();

		if ( rdcInfo ) {
			$('div#inFo2 table.table:eq(0) td:eq(0)').text(rdcInfo['rdc_model']);
			$('div#inFo2 table.table:eq(0) td:eq(1) > span:eq(0)').text(rdcInfo['rdc_ratio_l']);
			$('div#inFo2 table.table:eq(0) td:eq(1) > span:eq(1)').text(rdcInfo['rdc_ratio_r']);
			$('div#inFo2 table.table:eq(0) td:eq(2)').text(rdcInfo['rdc_stg_num'] + '???');

			$.each(rdcInfo['rdc_stg_info'], function(k,o) {
				///Todo : ?????? 2?????? ????????? ??????????????? ?????? ????????? rdc_stg_num
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
					toastr["success"]("?????????????????????.")
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

		/// ????????? ??? ?????????
		var brInfo = queryJson('device.machine_spec.br_info');
		var brClone = $('div#inFo3 table.table:eq(1)').parent().parent().clone();
		var brParent = $('div#inFo3 table.table:eq(1)').parent().parent().parent();
		$('div#inFo3 table.table:eq(3)').parent().parent().remove();
		$('div#inFo3 table.table:eq(2)').parent().parent().remove();
		$('div#inFo3 table.table:eq(1)').parent().parent().remove();

		/// ????????? ??? ??????
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
					toastr["success"]("?????????????????????.")
				});
			}
		});
		/// ????????? ?????? ??????
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

				/// ????????? ?????? ??????
				brObj.find('div.text-end > button').off().on('click', function() {
					brInfo['br_detail_info'].splice(brObj.attr('idx'),1);
					brObj.remove();

					window.wf.fn.device.post(function(result) {
						toastr["success"]("?????????????????????.")
					});
				});
				brParent.append(brObj);
			});
		}

		/// ?????? ??? V-?????? ?????? ??? ?????????
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
		/// ?????? ??? V-?????? ?????? ?????? 
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
					toastr["success"]("?????????????????????.")
				});
			}
		});

		/// ??????/????????? ???????????? ??? ???????????? ?????? ??? ?????????
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
					toastr["success"]("?????????????????????.")
				});
			}
		});

		/// ???????????? ???????????? ??? ???????????? ?????? ??? ?????????
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

				stSprketInfo['st_chain_r_material'] = (stSprketInfo['st_chain_r_material_name'] == '?????????') ? 'U' : 'ST';
				window.wf.fn.device.post(function(result) {
					toastr["success"]("?????????????????????.")
				});
			}
		});

		/// ????????? ?????? ??? ?????????
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
					toastr["success"]("?????????????????????.")
				});
			}
		});

		break;
	}

	case '01_003': { /* ?????? ????????? */
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

		/// ????????? ??????
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

		/// ????????? ??????
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

		/// ????????? ??????
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

		/// ?????? ??? V-?????? ??????
		var veltFault = queryJson('device.fault_freq.plly_belt_fault_freq');

		if (veltFault) {
			$('#freQuency4 tbody td:eq(0)').text(veltFault['drvn_fr'] + ' Hz');
			$('#freQuency4 tbody td:eq(1)').text(veltFault['vbelt_f'] + ' Hz');
		}

		/// ??????/????????? ???????????? ??? ????????? ??????
		var sprketFault = queryJson('device.fault_freq.drv_sprket_fault_freq');

		if (sprketFault) {
			$('#freQuency5 tbody td:eq(0)').text(sprketFault['drvn_fr'] + ' Hz');
			$('#freQuency5 tbody td:eq(1)').text(sprketFault['drv_sprket_gmf'] + ' Hz');
		}
		
		/// ????????? ??????
		var blowerFault = queryJson('device.fault_freq.blower_fault_freq');

		if (blowerFault) {
			$('#freQuency6 tbody td:eq(0)').text(blowerFault['blw_fan_f'] + ' Hz');
		}
		
		setTimeout(function() {
			$('div.row a.nav-link:visible:eq(0)').tab('show');
		}, 500);
		break;
	}

	/// ????????? ?????? ?????????
	case '01_004': { /* ????????? ?????? ????????? */
		//diag_threshold
		
		if ( diag_th_enable != "enable") {
		}

		if ( !diag_threshold ) {
			diag_threshold = {
				"snd_th_info": {
					"snd_oper_thre": {},
					"snd_fail_thre": {}
				},
				"vib_th_info": []
			}
		}
		
		/// ?????? ????????????/???????????? ?????? ?????????
		$('#reSet1 div.text-right > a.edit').on('click', function() {
			if ( $(this).find('i.fa-save').length > 0 ) {
				$('#reSet1 table:eq(0) td:eq(1) > input').text();
				$('#reSet1 table:eq(0) td:eq(3) > input').text();
				
				diag_threshold['snd_th_info']['snd_oper_thre']['min_threshold'] = parseFloat($('#reSet1 table:eq(0) td:eq(0) > input').val());
				diag_threshold['snd_th_info']['snd_oper_thre']['max_threshold'] = parseFloat($('#reSet1 table:eq(0) td:eq(1) > input').val());
				diag_threshold['snd_th_info']['snd_oper_thre']['frequency_threshold'] = parseFloat($('#reSet1 table:eq(0) td:eq(3) > input').val());
				diag_threshold['snd_th_info']['snd_fail_thre']['threshold'] = parseFloat($('#reSet1 table:eq(1) td:eq(0) > input').val());

				diag_threshold['snd_th_info']['update_time'] = timestamp().replaceAll('-', '/');
				diag_threshold['snd_th_info']['update_type'] = 'manual';
				diag_threshold['snd_th_info']['update_name'] = '@{db.member.name}';

				setJson('device.diag_threshold', diag_threshold)
				window.wf.fn.device.post(function(result) {
					toastr["success"]("?????????????????????.")
				});
			}
		});
		var snd_th_info = diag_threshold['snd_th_info'];
		if ( snd_th_info ) {
			var snd_oper_thre = snd_th_info['snd_oper_thre'];
			if ( snd_oper_thre ) {
				$('#reSet1 table:eq(0) td:eq(0)').text(snd_oper_thre['min_threshold']+'');
				$('#reSet1 table:eq(0) td:eq(1)').text(snd_oper_thre['max_threshold']+'');
				$('#reSet1 table:eq(0) td:eq(2)').text(snd_oper_thre['target_frequency']+'');
				$('#reSet1 table:eq(0) td:eq(3)').text(snd_oper_thre['frequency_threshold']+'');
			}

			var snd_fail_thre = snd_th_info['snd_fail_thre'];
			if ( snd_fail_thre ) {
				$('#reSet1 table:eq(1) td:eq(0)').text(snd_fail_thre['threshold']+'');
			}

			$('#reSet1 table:eq(2) td:eq(0)').text(snd_th_info['update_time']);
			$('#reSet1 table:eq(2) td:eq(1)').text(snd_th_info['update_type']);
			$('#reSet1 table:eq(2) td:eq(2)').text(snd_th_info['update_name']);
		}

		/// ?????? ?????? ????????? ??? ??????
		var vib_th_info = diag_threshold['vib_th_info'];	

		if ( vib_th_info ) {
			var sensorIdClone = $('#reSet2 div.nav > a:eq(0)').clone();
			$('#reSet2 div.nav > a').remove();
			var sensorDivClone = $('#senSor1').clone();
			var sensorDivGrp = $('#senSor1').parent();
			sensorDivGrp.empty();
			for ( var i=0; i < vib_th_info.length; i++ ) {
				var sensorTab = sensorIdClone.clone();
				sensorTab.text(vib_th_info[i]['iot_sensor_id']);
				sensorTab.off().on('click', function() {
					sensorDivGrp.children().hide();
					$(sensorDivGrp.children().get($(this).index())).show();
				});
				$('#reSet2 div.nav').append(sensorTab);

				var sensorDiv = sensorDivClone.clone();
				sensorDiv.hide();

				sensorDiv.find('div.text-right > a.edit').on('click', function() {
					if ( $(this).find('i.fa-save').length > 0 ) {
						if ( !vib_th_info ) {
							vib_th_info = [
								{ "axi_th": {},
								  "hr_th": {},
								  "vr_th": {},
								  "th_range": {}
								}

							];
						}
						var sensorDiv = $(this).closest('#senSor1');

						var i = $(this).closest('#senSor1').index();
						vib_th_info[i]['th_range']['range_subhamo'] = sensorDiv.find('table:eq(0) td:eq(0) > span > input').val();
						vib_th_info[i]['th_range']['range_1xrpm'] = sensorDiv.find('table:eq(0) td:eq(1) > span > input').val();
						vib_th_info[i]['th_range']['range_2xrpm'] = sensorDiv.find('table:eq(0) td:eq(2) > span > input').val();
						vib_th_info[i]['th_range']['range_3_4xrpm'] = sensorDiv.find('table:eq(0) td:eq(3) > span > input').val();
						vib_th_info[i]['th_range']['range_5_12xrpm'] = sensorDiv.find('table:eq(0) td:eq(4) > span > input').val();
						vib_th_info[i]['th_range']['range_hfd'] = sensorDiv.find('table:eq(0) td:eq(5) > span > input').val();
						vib_th_info[i]['th_range']['range_end'] = sensorDiv.find('table:eq(0) td:eq(6) > span > input').val();

						vib_th_info[i]['iot_pos'] = sensorDiv.find('table:eq(1) tbody > tr:eq(0) > td:eq(0) > input').val();

						vib_th_info[i]['axi_th']['axi_subhamo'] = sensorDiv.find('table:eq(1) tbody > tr:eq(2) > td:eq(0) > input').val();
						vib_th_info[i]['hr_th']['hr_subhamo'] = sensorDiv.find('table:eq(1) tbody > tr:eq(2) > td:eq(1) > input').val();
						vib_th_info[i]['vr_th']['vr_subhamo'] = sensorDiv.find('table:eq(1) tbody > tr:eq(2) > td:eq(2) > input').val();
						vib_th_info[i]['axi_th']['axi_1xrpm'] = sensorDiv.find('table:eq(1) tbody > tr:eq(3) > td:eq(0) > input').val();
						vib_th_info[i]['hr_th']['hr_1xrpm'] = sensorDiv.find('table:eq(1) tbody > tr:eq(3) > td:eq(1) > input').val();
						vib_th_info[i]['vr_th']['vr_1xrpm'] = sensorDiv.find('table:eq(1) tbody > tr:eq(3) > td:eq(2) > input').val();
						vib_th_info[i]['axi_th']['axi_2xrpm'] = sensorDiv.find('table:eq(1) tbody > tr:eq(4) > td:eq(0) > input').val();
						vib_th_info[i]['hr_th']['hr_2xrpm'] = sensorDiv.find('table:eq(1) tbody > tr:eq(4) > td:eq(1) > input').val();
						vib_th_info[i]['vr_th']['vr_2xrpm'] = sensorDiv.find('table:eq(1) tbody > tr:eq(4) > td:eq(2) > input').val();
						vib_th_info[i]['axi_th']['axi_3_4xrpm'] = sensorDiv.find('table:eq(1) tbody > tr:eq(5) > td:eq(0) > input').val();
						vib_th_info[i]['hr_th']['hr_3_4xrpm'] = sensorDiv.find('table:eq(1) tbody > tr:eq(5) > td:eq(1) > input').val();
						vib_th_info[i]['vr_th']['vr_3_4xrpm'] = sensorDiv.find('table:eq(1) tbody > tr:eq(5) > td:eq(2) > input').val();
						vib_th_info[i]['axi_th']['axi_5_12xrpm'] = sensorDiv.find('table:eq(1) tbody > tr:eq(6) > td:eq(0) > input').val();
						vib_th_info[i]['hr_th']['hr_5_12xrpm'] = sensorDiv.find('table:eq(1) tbody > tr:eq(6) > td:eq(1) > input').val();
						vib_th_info[i]['vr_th']['vr_5_12xrpm'] = sensorDiv.find('table:eq(1) tbody > tr:eq(6) > td:eq(2) > input').val();
						vib_th_info[i]['axi_th']['axi_hfd'] = sensorDiv.find('table:eq(1) tbody > tr:eq(7) > td:eq(0) > input').val();
						vib_th_info[i]['hr_th']['hr_hfd'] = sensorDiv.find('table:eq(1) tbody > tr:eq(7) > td:eq(1) > input').val();
						vib_th_info[i]['vr_th']['vr_hfd'] = sensorDiv.find('table:eq(1) tbody > tr:eq(7) > td:eq(2) > input').val();

						setJson('device.diag_threshold', diag_threshold)
						window.wf.fn.device.post(function(result) {
							toastr["success"]("?????????????????????.")
						});

					}
				});

				sensorDiv.find('table:eq(0) td:eq(0) > span').text(vib_th_info[i]['th_range']['range_subhamo']);
				sensorDiv.find('table:eq(0) td:eq(1) > span').text(vib_th_info[i]['th_range']['range_1xrpm']);
				sensorDiv.find('table:eq(0) td:eq(2) > span').text(vib_th_info[i]['th_range']['range_2xrpm']);
				sensorDiv.find('table:eq(0) td:eq(3) > span').text(vib_th_info[i]['th_range']['range_3_4xrpm']);
				sensorDiv.find('table:eq(0) td:eq(4) > span').text(vib_th_info[i]['th_range']['range_5_12xrpm']);
				sensorDiv.find('table:eq(0) td:eq(5) > span').text(vib_th_info[i]['th_range']['range_hfd']);
				sensorDiv.find('table:eq(0) td:eq(6) > span').text(vib_th_info[i]['th_range']['range_end']);

				sensorDiv.find('table:eq(1) tbody > tr:eq(0) > td:eq(0)').text(vib_th_info[i]['iot_pos']);

				sensorDiv.find('table:eq(1) tbody > tr:eq(2) > td:eq(0)').text(vib_th_info[i]['axi_th']['axi_subhamo']);
				sensorDiv.find('table:eq(1) tbody > tr:eq(2) > td:eq(1)').text(vib_th_info[i]['hr_th']['hr_subhamo']);
				sensorDiv.find('table:eq(1) tbody > tr:eq(2) > td:eq(2)').text(vib_th_info[i]['vr_th']['vr_subhamo']);
				sensorDiv.find('table:eq(1) tbody > tr:eq(3) > td:eq(0)').text(vib_th_info[i]['axi_th']['axi_1xrpm']);
				sensorDiv.find('table:eq(1) tbody > tr:eq(3) > td:eq(1)').text(vib_th_info[i]['hr_th']['hr_1xrpm']);
				sensorDiv.find('table:eq(1) tbody > tr:eq(3) > td:eq(2)').text(vib_th_info[i]['vr_th']['vr_1xrpm']);
				sensorDiv.find('table:eq(1) tbody > tr:eq(4) > td:eq(0)').text(vib_th_info[i]['axi_th']['axi_2xrpm']);
				sensorDiv.find('table:eq(1) tbody > tr:eq(4) > td:eq(1)').text(vib_th_info[i]['hr_th']['hr_2xrpm']);
				sensorDiv.find('table:eq(1) tbody > tr:eq(4) > td:eq(2)').text(vib_th_info[i]['vr_th']['vr_2xrpm']);
				sensorDiv.find('table:eq(1) tbody > tr:eq(5) > td:eq(0)').text(vib_th_info[i]['axi_th']['axi_3_4xrpm']);
				sensorDiv.find('table:eq(1) tbody > tr:eq(5) > td:eq(1)').text(vib_th_info[i]['hr_th']['hr_3_4xrpm']);
				sensorDiv.find('table:eq(1) tbody > tr:eq(5) > td:eq(2)').text(vib_th_info[i]['vr_th']['vr_3_4xrpm']);
				sensorDiv.find('table:eq(1) tbody > tr:eq(6) > td:eq(0)').text(vib_th_info[i]['axi_th']['axi_5_12xrpm']);
				sensorDiv.find('table:eq(1) tbody > tr:eq(6) > td:eq(1)').text(vib_th_info[i]['hr_th']['hr_5_12xrpm']);
				sensorDiv.find('table:eq(1) tbody > tr:eq(6) > td:eq(2)').text(vib_th_info[i]['vr_th']['vr_5_12xrpm']);
				sensorDiv.find('table:eq(1) tbody > tr:eq(7) > td:eq(0)').text(vib_th_info[i]['axi_th']['axi_hfd']);
				sensorDiv.find('table:eq(1) tbody > tr:eq(7) > td:eq(1)').text(vib_th_info[i]['hr_th']['hr_hfd']);
				sensorDiv.find('table:eq(1) tbody > tr:eq(7) > td:eq(2)').text(vib_th_info[i]['vr_th']['vr_hfd']);

				if ( i == 0 ) {
					sensorDiv.show();
				}
				sensorDivGrp.append(sensorDiv);
			}

		}

		break;
	}
		
	/// ????????? ?????? ??????	
	case '02_002': {
		var sensorChar = 'v';
		var chartData = null;
		var vFiles = [];
		var nFiles = [];
		var cloneNode = $('#sensorList1 tbody > tr:eq(0)').clone();
		var optNode = $('#sensor-ID1 option:eq(0)').clone();
		$('#sensor-ID1').on('change', function() {
			getChart(this.value);
		});

		function getChart(fileName) {
			window.wf.fn.getChart(fileName, function(data) {
				vFiles = [];
				nFiles = [];
				chartData = data;
				window.wf.fn.chart('sensorChart1', chartData['x'], 0, 0);

				var fileList = chartData['list'];
				/// ICTR01_3_V_210618152300.num
				var fileInfo = chartData['file'].match(/_(\d{12})\.num/);
				if ( fileInfo.length > 1) {
					var m = fileInfo[1];
					$('#senSor1 div.float-end').text('?????? ?????? : ' + m.substr(0,4) + '/' + m.substr(4,2) + '/' + m.substr(6,2) + ' ' + m.substr(8,2) + ':' + m.substr(10,2)  );
				}
				/// list
				if ( $.fn.DataTable.isDataTable("#sensorList1") ) {
					$('#sensorList1').DataTable().clear().destroy();
				}
				$('#sensorList1 tbody > tr').remove();
				$('#sensor-ID1 option').remove();
				
				for ( var i = 0; i < fileList.length; i++ ) {
					var fileNode = cloneNode.clone();
					var opt = optNode.clone();
					opt.val(fileList[i]);
					if ( i == 0 ) {
						opt.prop('selected', true);
					}
					//fileNode.hide();
					var fileName = fileList[i].substr(fileList[i].lastIndexOf('/') + 1);
					var fileInfo = fileName.match(/_(\d{12})\.num/);
					if ( fileInfo.length > 1) {
						var m = fileInfo[1];
						fileNode.find('> td:eq(1)').text(m.substr(0,4) + '/' + m.substr(4,2) + '/' + m.substr(6,2) + ' ' + m.substr(8,2) + ':' + m.substr(10,2));

					}
					opt.text(fileName);
					fileNode.find('> td:eq(2)').text(fileName);
					fileNode.find('> td:eq(3) > button').attr('file', fileList[i]).on('click', function() {
						location.href = "/rest/download?file=" + $(this).attr('file');
					});
					
					if ( fileList[i].indexOf('_V_') == -1 ) {
						nFiles.push(fileList[i]);
						fileNode.addClass('n');
						if (sensorChar == 'n') {
							$('#sensorList1 tbody').append(fileNode);
							$('#sensor-ID1').append(opt);
						}
					}
					else {
						vFiles.push(fileList[i]);
						fileNode.addClass('v');
						if (sensorChar == 'v') {
							$('#sensorList1 tbody').append(fileNode);
							$('#sensor-ID1').append(opt);
						}
					}
				}

				$('li.nav-item:eq(0) > a > span').text('?????? ?????? ( ' + vFiles.length + ' )');
				$('li.nav-item:eq(1) > a > span').text('?????? ?????? ( ' + nFiles.length + ' )');
				//$('#sensorList1 tbody > tr.' + sensorChar).show();

				if (sensorChar == 'n') {
					$('input[name=formRadio1]:eq(1)').parent().hide();
					$('input[name=formRadio1]:eq(2)').parent().hide();
				}
				else {
					$('input[name=formRadio1]:eq(1)').parent().show();
					$('input[name=formRadio1]:eq(2)').parent().show();
				}

				$("#sensorList1").DataTable({
					order: [[1, 'desc']],
					ordering: true,
					pageLength: 20,
					serverSide: false,
					select: true,
					lengthMenu:  [20, 40, 60, 80, 100 ],
					dom:
					"<'row'<'col-sm-12'tr>>" +
						"<'row mb-4'<'col-sm-12 col-md-5'l><'col-sm-12 col-md-7'p>>",
					language: {
						zeroRecords: "????????? IP ??? ????????????.",
						search: "",
						searchPlaceholder: "????????? ??????",
						lengthMenu: "_MENU_ ??? ??????",
						paginate: {
							first:"??????",
							previous:"??????",
							next: "??????",
							last:"??????"
						}
					}
				});

				setTimeout(function() {
					$('#senSor2').removeClass('active');
					$('#senSor1').addClass('active');
				}, 500);
				
			});
		}
		setTimeout(function() { getChart('num'); }, 100);

		/// ??????, ?????? ?????? click
		$('li.nav-item > a').off().on('click', function() {
			if ( this.href.indexOf('senSor1') != -1 ) {
				sensorChar = 'v';
				if ( vFiles.length > 0 ) {
					getChart(vFiles[0]);
				}
			}
			else {
				sensorChar = 'n';
				if ( nFiles.length > 0 ) {
					getChart(nFiles[0]);
				}
			}
		});

		/// ??????, ??????, ?????? ?????? radio click
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
		
	/// ????????? FFT 
	case '02_003': {
		var searchStart = null;
		var searchEnd = null;
		var chartData = null;
		var vFiles = [];
		var cloneNode = $('#sensorList1 tbody > tr:eq(0)').clone();
		var optNode = $('#sensor-ID1 option:eq(0)').clone();
		$('#sensor-ID1').on('change', function() {
			getChartFFT(this.value);
		});
		function getChartFFT(fileName) {
			window.wf.fn.getChart(fileName, function(data) {
				vFiles = [];
				chartData = data;

				window.wf.fn.chartFFT(chartData['x'], 0, 0);

				var fileList = chartData['list'];
				var fileInfo = chartData['file'].match(/(\d{8}-\d{6})[^.]*\.txt/);
				if ( fileInfo.length > 1) {
					var m = fileInfo[1];
					$('#a_form3').parent().siblings('.float-end').text('?????? ?????? : ' + m.substr(0,4) + '/' + m.substr(4,2) + '/' + m.substr(6,2) + ' ' + m.substr(9,2) + ':' + m.substr(11,2)  );
				}
				/// list
				if ( $.fn.DataTable.isDataTable("#sensorList1") ) {
					$('#sensorList1').DataTable().clear().destroy();
				}
				$('#sensorList1 tbody > tr').remove();
				$('#sensor-ID1 option').remove();
				
				for ( var i = 0; i < fileList.length; i++ ) {
					var fileNode = cloneNode.clone();
					var opt = optNode.clone();
					opt.val(fileList[i]);
					if ( i == 0 ) {
						opt.prop('selected', true);
					}
					//fileNode.hide();
					var fileName = fileList[i].substr(fileList[i].lastIndexOf('/') + 1);
					var fileInfo = fileName.match(/(\d{8}-\d{6})[^.]*\.txt/);
					if ( fileInfo.length > 1) {
						var m = fileInfo[1];
						fileNode.find('> td:eq(1)').text(m.substr(0,4) + '/' + m.substr(4,2) + '/' + m.substr(6,2) + ' ' + m.substr(9,2) + ':' + m.substr(11,2));

					}
					opt.text(fileName);
					fileNode.find('> td:eq(2)').text(fileName);
					fileNode.find('> td:eq(3) > button').attr('file', fileList[i]).on('click', function() {
						location.href = "/rest/download?file=" + $(this).attr('file');
					});
					
					vFiles.push(fileList[i]);
					$('#sensorList1 tbody').append(fileNode);
					$('#sensor-ID1').append(opt);
				}

				$("#sensorList1").DataTable({
					order: [[1, 'desc']],
					ordering: true,
					pageLength: 20,
					serverSide: false,
					select: true,
					lengthMenu:  [20, 40, 60, 80, 100 ],
					dom:
					"<'row'<'col-sm-12'tr>>" +
						"<'row mb-4'<'col-sm-12 col-md-5'l><'col-sm-12 col-md-7'p>>",
					language: {
						zeroRecords: "????????? IP ??? ????????????.",
						search: "",
						searchPlaceholder: "????????? ??????",
						lengthMenu: "_MENU_ ??? ??????",
						paginate: {
							first:"??????",
							previous:"??????",
							next: "??????",
							last:"??????"
						}
					}
				});
			});
		}
								   
		setTimeout(function() { getChartFFT('fft'); }, 100);

		/// ??????, ??????, ?????? ?????? radio click
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

			window.wf.fn.chartFFT(chartData[typeChar], 0, 0);
		});
		$('button > i.uil-search').parent().on('click', function() {
			searchStart = $('input[name=start]').val();
			searchEnd = $('input[name=end]').val();
			//setTimeout(function() { getChartFFT('fft'); }, 100);
		});
		break;
	}

	case '03_001_0001': { /* ????????? ????????? */
		/* ????????? ?????? */
		$('div.row a.btn-success').on('click', function() {
			location.href = '/wf/03_001_0002.html';
		});
		window.wf.fn.member.list();
		break;
	}

	case '03_001_0002': { /* ????????? ?????? */
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

	case '03_001_0003': { /* ????????? ?????? */
		/// ????????? idx ???
		var memberId = getUrlVars()['id'];
		/// ????????? ??? ?????????
		$('div.row.p-2 > div:nth-child(2)').text('')
		/// ?????? ??????
		$('div.row div.text-end > button:nth-child(1)').off().on('click', function() {
			window.wf.fn.member.del(memberId);
		});
		/// ???????????? ????????? ?????? [ ?????? X  ]
		$('div.row div.text-end > button:nth-child(2)').off().on('click', function() {});
		
		/// ???????????? ????????? ??????????????? ?????? ??????
		$('#pwModal div.text-end > button.btn-primary').off().on('click', function() {
			$('#pwModal form input').each(function( index ) {
				if ( !$( this ).val() ) {
					$(this).siblings('div').show();
				}
			});
			
			var pw = $('#pwModal form input:nth-child(1)').get(0).value;
			var pw2 = $('#pwModal form input:nth-child(1)').get(1).value;
			
			if ( !pw || pw != pw2 ) {
				alert('??????????????? ???????????? ????????????');
				return;
			}
			
			window.wf.fn.member.changePw(memberId, pw);
		});
	    /// ?????? ??????
		$('div.row div.text-end > button:nth-child(3)').off().on('click', function() {
			location.href = '/wf/03_001_0004.html?id=' + memberId;
		});
		/// ????????? ??????
		$('div.row div.text-end > a.btn').off().on('click', function() {
			location.href = '/wf/03_001_0001.html';
		});
		/// ????????? ?????? ?????? ????????????														 
		window.wf.fn.member.get(memberId, function(data) {
			if ( data['member'] ) {
				var grpElm = $('div.row.p-2 > div:nth-child(2)');
				$(grpElm.get(0)).text(data.member.name);
				$(grpElm.get(1)).text(data.member.id);
				$(grpElm.get(2)).text(data.member.email);
				$(grpElm.get(3)).text(data.member.tel);
				if ( data.member.role == -1 ) {
					$(grpElm.get(4)).text('?????????');
				}
				else {
					$(grpElm.get(4)).text('?????????');
				}
				$(grpElm.get(5)).text(data.member.createDt);
				$(grpElm.get(6)).text(data.member.pid);
				$(grpElm.get(7)).text(data.member.modifyDt);
				$(grpElm.get(8)).text(data.member.mid);
			}
		});
		break;
	}

	case '03_001_0004': { /* ????????? ?????? */
		/// ????????? idx ???
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
		
		/// ????????? ?????? ?????? ??????
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

	case '03_002': { /* ????????? ?????? */
		/// ip ??????
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

		$('#seT1 div > a.edit').off().on('click', function() {
			if ( $(this).find('i.fa-save').length > 0 ) {
				var cfg = {};
				cfg['addr'] = $('#seT1 > div.card:eq(2) tbody td:eq(0) > input').val();
				cfg['netmask'] = $('#seT1 > div.card:eq(2) tbody td:eq(1) > input').val();
				cfg['gateway'] = $('#seT1 > div.card:eq(2) tbody td:eq(2) > input').val();
				cfg['dns1'] = $('#seT1 > div.card:eq(2) tbody td:eq(3) > input').val();
				cfg['dns2'] = $('#seT1 > div.card:eq(2) tbody td:eq(4) > input').val();

				var subp = {'type': 'ifcfg', 'val': cfg};
					window.wf.fn.device.post(function(result) {
						toastr["success"]("?????????????????????.")
					}, subp);
			}
		});

		/// ssh ??????
		var ssh = queryJson('device.system.ssh') || '???????????? ????????????.';
		setJson('device.system.ssh', ssh);

		$('#seT2 td:eq(0)').text(ssh);
		$('#seT2 div > a.edit').off().on('click', function() {
			if ( $(this).find('i.fa-save').length > 0 ) {
				setJson('device.system.ssh', $('#seT2 td:eq(0) > select').val());
				var subp = {'type': 'ssh', 'val': false};
				if ( $('#seT2 td:eq(0) > select').val() == '???????????????.' ) {
					subp['val'] = 'true';
				}
				window.wf.fn.device.post(function(result) {
					toastr["success"]("?????????????????????.")
				}, subp);
			}
		});
		
		/// network time ??????
		var ntp = queryJson('device.system.ntp') || '???????????? ????????????.';
		setJson('device.system.ntp', ntp);

		$('#seT3 td:eq(0)').text(ntp);
		$('#seT3 div > a.edit').off().on('click', function() {
			if ( $(this).find('i.fa-save').length > 0 ) {
				setJson('device.system.ntp', $('#seT3 td:eq(0) > select').val());
				var subp = {'type': 'ntp', 'val': false};
				if ( $('#seT3 td:eq(0) > select').val() == '???????????????.' ) {
					subp['val'] = 'true';
				}
				window.wf.fn.device.post(function(result) {
					toastr["success"]("?????????????????????.")
				}, subp);
			}
		});
		
		/// locale ??????
		var locale = queryJson('device.system.locale') || '(UTC+09:00) Seoul';
		setJson('device.system.locale', locale);

		$('#seT4 td:eq(0)').text(locale);
		$('#seT4 div > a.edit').off().on('click', function() {
			if ( $(this).find('i.fa-save').length > 0 ) {
				var localeVar = $('#seT4 td:eq(0) > select').val();
				setJson('device.system.locale', localeVar);
				var subp = {'type': 'locale', 'val': localeVar};
				//var subp = {'type': 'locale', 'val': 'Asia/Seoul'};
				window.wf.fn.device.post(function(result) {
					toastr["success"]("?????????????????????.")
				}, subp);
			}
		});

		break;
	}
	/// ?????? ?????? ( iptables )
	case '03_003': { /* ?????? ?????? */
		var iptables = queryJson('device.system.iptable');
		var ipClone = $('#ipList tbody tr:eq(0)').clone();
		$('#ipList tbody tr').remove();

		if ( iptables ) {
			for ( var i=0; i < iptables.length; i++ ) {

				var ip = iptables[i]['ip'];
				var ipElm = ipClone.clone();
				ipElm.find('td:eq(0)').text((ip.indexOf('-') == -1) ? '??????' : '??????');
				ipElm.find('td:eq(1)').text(ip);
				ipElm.find('td:eq(2)').text(iptables[i]['date']);
				ipElm.find('td:eq(3)').text(iptables[i]['user']);
				
				$('#ipList tbody').append(ipElm);
				ipElm.find('td:eq(4) > button').off().on('click', function() {
					var removeIp = iptables.splice($(this).parent().parent().index(), 1);
					var subp = {'type': 'iptable-remove', 'val': removeIp[0]['ip']};
					window.wf.fn.device.post(function(result) {
						location.reload(true);
					}, subp);
				});
			}
		}

		$('div.row  a.btn-success').off().on('click', function() {
			$('#ipModal form input.form-control').val('');
		});

		$('#ipModal form').off().on('submit', function() {return false});

		$('#ipModal form button.btn-primary').off().on('click', function() {
			var ipObj = $('#iptable'); 
			var acceptIp = ipObj.val();

			if ( !acceptIp ) {
				$('#ipModal form div.invalid-text').show();
				return;
			}

			if ( !iptables ) {
				iptables = setJson('device.system.iptable', []);
			}

			var acceptInfo = {'user': '@{db.member.name}', ip: acceptIp, date: timestamp()}; 
			iptables.push(acceptInfo);
			var subp = {'type': 'iptable', 'val': acceptIp};
			$('#ipModal').modal('hide');
			window.wf.fn.device.post(function(result) {
				location.reload(true);
			}, subp);
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

