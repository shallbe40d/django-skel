$(function () {
	var timezones = {
		'(UTC-10:00) Hawaii': 'Pacific/Honolulu'
		,'(UTC-09:00) Alaska': 'America/Anchorage'
		,'(UTC-08:00) Baja California': 'America/Santa_Isabel'
		,'(UTC-08:00) Pacific Time (US and Canada)': 'America/Los_Angeles'
		,'(UTC-07:00) Chihuahua, La Paz, Mazatlan': 'America/Chihuahua'
		,'(UTC-07:00) Arizona': 'America/Phoenix'
		,'(UTC-07:00) Mountain Time (US and Canada)': 'America/Denver'
		,'(UTC-06:00) Central America': 'America/Guatemala'
		,'(UTC-06:00) Central Time (US and Canada)': 'America/Chicago'
		,'(UTC-06:00) Saskatchewan': 'America/Regina'
		,'(UTC-06:00) Guadalajara, Mexico City, Monterey': 'America/Mexico_City'
		,'(UTC-05:00) Bogota, Lima, Quito': 'America/Bogota'
		,'(UTC-05:00) Indiana (East)': 'America/Indiana/Indianapolis'
		,'(UTC-05:00) Eastern Time (US and Canada)': 'America/New_York'
		,'(UTC-04:30) Caracas': 'America/Caracas'
		,'(UTC-04:00) Atlantic Time (Canada)': 'America/Halifax'
		,'(UTC-04:00) Asuncion': 'America/Asuncion'
		,'(UTC-04:00) Georgetown, La Paz, Manaus, San Juan': 'America/La_Paz'
		,'(UTC-04:00) Cuiaba': 'America/Cuiaba'
		,'(UTC-04:00) Santiago': 'America/Santiago'
		,'(UTC-03:30) Newfoundland': 'America/St_Johns'
		,'(UTC-03:00) Brasilia': 'America/Sao_Paulo'
		,'(UTC-03:00) Greenland': 'America/Godthab'
		,'(UTC-03:00) Cayenne, Fortaleza': 'America/Cayenne'
		,'(UTC-03:00) Buenos Aires': 'America/Argentina/Buenos_Aires'
		,'(UTC-03:00) Montevideo': 'America/Montevideo'
		,'(UTC-02:00) Coordinated Universal Time-2': 'Etc/GMT+2'
		,'(UTC-01:00) Cape Verde': 'Atlantic/Cape_Verde'
		,'(UTC-01:00) Azores': 'Atlantic/Azores'
		,'(UTC+00:00) Casablanca': 'Africa/Casablanca'
		,'(UTC+00:00) Monrovia, Reykjavik': 'Atlantic/Reykjavik'
		,'(UTC+00:00) Dublin, Edinburgh, Lisbon, London': 'Europe/London'
		,'(UTC+00:00) Coordinated Universal Time': 'Etc/GMT'
		,'(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna': 'Europe/Berlin'
		,'(UTC+01:00) Brussels, Copenhagen, Madrid, Paris': 'Europe/Paris'
		,'(UTC+01:00) West Central Africa': 'Africa/Lagos'
		,'(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague': 'Europe/Budapest'
		,'(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb': 'Europe/Warsaw'
		,'(UTC+01:00) Windhoek': 'Africa/Windhoek'
		,'(UTC+02:00) Athens, Bucharest, Istanbul': 'Europe/Istanbul'
		,'(UTC+02:00) Helsinki, Kiev, Riga, Sofia, Tallinn, Vilnius': 'Europe/Kiev'
		,'(UTC+02:00) Cairo': 'Africa/Cairo'
		,'(UTC+02:00) Damascus': 'Asia/Damascus'
		,'(UTC+02:00) Amman': 'Asia/Amman'
		,'(UTC+02:00) Harare, Pretoria': 'Africa/Johannesburg'
		,'(UTC+02:00) Jerusalem': 'Asia/Jerusalem'
		,'(UTC+02:00) Beirut': 'Asia/Beirut'
		,'(UTC+03:00) Baghdad': 'Asia/Baghdad'
		,'(UTC+03:00) Minsk': 'Europe/Minsk'
		,'(UTC+03:00) Kuwait, Riyadh': 'Asia/Riyadh'
		,'(UTC+03:00) Nairobi': 'Africa/Nairobi'
		,'(UTC+03:30) Tehran': 'Asia/Tehran'
		,'(UTC+04:00) Moscow, St. Petersburg, Volgograd': 'Europe/Moscow'
		,'(UTC+04:00) Tbilisi': 'Asia/Tbilisi'
		,'(UTC+04:00) Yerevan': 'Asia/Yerevan'
		,'(UTC+04:00) Abu Dhabi, Muscat': 'Asia/Dubai'
		,'(UTC+04:00) Baku': 'Asia/Baku'
		,'(UTC+04:00) Port Louis': 'Indian/Mauritius'
		,'(UTC+04:30) Kabul': 'Asia/Kabul'
		,'(UTC+05:00) Tashkent': 'Asia/Tashkent'
		,'(UTC+05:00) Islamabad, Karachi': 'Asia/Karachi'
		,'(UTC+05:30) Sri Jayewardenepura Kotte': 'Asia/Colombo'
		,'(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi': 'Asia/Kolkata'
		,'(UTC+05:45) Kathmandu': 'Asia/Kathmandu'
		,'(UTC+06:00) Astana': 'Asia/Almaty'
		,'(UTC+06:00) Dhaka': 'Asia/Dhaka'
		,'(UTC+06:00) Yekaterinburg': 'Asia/Yekaterinburg'
		,'(UTC+06:30) Yangon': 'Asia/Yangon'
		,'(UTC+07:00) Bangkok, Hanoi, Jakarta': 'Asia/Bangkok'
		,'(UTC+07:00) Novosibirsk': 'Asia/Novosibirsk'
		,'(UTC+08:00) Krasnoyarsk': 'Asia/Krasnoyarsk'
		,'(UTC+08:00) Ulaanbaatar': 'Asia/Ulaanbaatar'
		,'(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi': 'Asia/Shanghai'
		,'(UTC+08:00) Perth': 'Australia/Perth'
		,'(UTC+08:00) Kuala Lumpur, Singapore': 'Asia/Singapore'
		,'(UTC+08:00) Taipei': 'Asia/Taipei'
		,'(UTC+09:00) Irkutsk': 'Asia/Irkutsk'
		,'(UTC+09:00) Seoul': 'Asia/Seoul'
		,'(UTC+09:00) Osaka, Sapporo, Tokyo': 'Asia/Tokyo'
		,'(UTC+09:30) Darwin': 'Australia/Darwin'
		,'(UTC+09:30) Adelaide': 'Australia/Adelaide'
		,'(UTC+10:00) Hobart': 'Australia/Hobart'
		,'(UTC+10:00) Yakutsk': 'Asia/Yakutsk'
		,'(UTC+10:00) Brisbane': 'Australia/Brisbane'
		,'(UTC+10:00) Guam, Port Moresby': 'Pacific/Port_Moresby'
		,'(UTC+10:00) Canberra, Melbourne, Sydney': 'Australia/Sydney'
		,'(UTC+11:00) Vladivostok': 'Asia/Vladivostok'
		,'(UTC+11:00) Solomon Islands, New Caledonia': 'Pacific/Guadalcanal'
		,'(UTC+12:00) Coordinated Universal Time+12': 'Etc/GMT-12'
		,'(UTC+12:00) Fiji, Marshall Islands': 'Pacific/Fiji'
		,'(UTC+12:00) Magadan': 'Asia/Magadan'
		,'(UTC+12:00) Auckland, Wellington': 'Pacific/Auckland'
		,'(UTC+13:00) Nuku\'alofa': 'Pacific/Tongatapu'
		,'(UTC+13:00) Samoa': 'Pacific/'
	};
	var e = {};
	$(".table-responsive").editable({
		dropdowns: {
			level: ["2단", "3단"],
			position: ["좌측 축베어링 (drvnlsb)", "우측 축베어링 (drvnrsb)", "전동기 부하측 베어링 (mlsb)", "전동기 반부하측 베어링 (mhlsb)", "감속기 1단 피니언 우측 베어링 (d1prb)", "감속기 1단 기어 좌측 베어링 (d1glb)", "감속기 1단 기어 우측 베어링 (d1grb)", "감속기 2단 피니언 좌측 베어링 (d2plb)", "감속기 2단 피니언 우측 베어링 (d2prb)", "감속기 2단 기어 좌측 베어링 (d2glb)", "감속기 2단 기어 우측 베어링 (d2grb)", "감속기 3단 피니언 좌측 베어링 (d3plb)", "감속기 3단 피니언 우측 베어링 (d3prb)", "감속기 3단 기어 좌측 베어링 (d3glb)", "감속기 3단 기어 우측 베어링 (d3grb)"],
			material: ["스틸", "우레탄"],
			ssh: ["허용하지 않습니다.", "허용합니다."],
			set: ["IP", "도메인"],
			time: Object.keys(timezones)
		},
		edit: function (t) {
			$(".edit i", this).removeClass("fa-pencil-alt").addClass("fa-save").attr("title", "Save")
		},
		save: function (t) {
			$(".edit i", this).removeClass("fa-save").addClass("fa-pencil-alt").attr("title", "Edit"), this in e && (e[this].destroy(), delete e[this])
		},
		cancel: function (t) {
			$(".edit i", this).removeClass("fa-save").addClass("fa-pencil-alt").attr("title", "Edit"), this in e && (e[this].destroy(), delete e[this])
		}
	})
});
