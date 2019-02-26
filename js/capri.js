(function() {
  'use strict';

  var app = {
    isLoading: true,
    visibleCards: {},
    selectedPrs: [],
    cardTemplate: document.querySelector('.cardTemplate'),
    container: document.querySelector('.main'),
    addDialog: document.querySelector('.dialog-container')
  };

  var pr_goods = [
    "orange",
    "orange_mango",
    "apple",
    "safari",
    "fairy",
    "alaska"
  ];

  var pr_goods_name_address = {
    "orange" : ["오렌지맛", "http://www.ssg.com/item/itemView.ssg?itemId=0000006610778"],
    "orange_mango": ["오렌지망고맛", "http://www.ssg.com/item/itemView.ssg?itemId=0000006610896"],
    "apple": ["사과맛", "http://www.ssg.com/item/itemView.ssg?itemId=0000007703166"],
    "safari": ["사파리", "http://www.ssg.com/item/itemView.ssg?itemId=0000007695749"],
    "fairy": ["페어리", "http://www.ssg.com/item/itemView.ssg?itemId=1000017758169"],
    "alaska": ["알라스카", "http://www.ssg.com/item/itemView.ssg?itemId=0000008117934"]
  };



  function loadLatestData() {
    if (localStorage.latestData) {
      return JSON.parse(localStorage.latestData);
    }

    return null;
  }

  function saveLatestData(r) {
      var lastData = JSON.stringify(r);
      localStorage.latestData = lastData;
  }

  function setCards() {
    app.selectedPrs = localStorage.selectedPrs;
    if (app.selectedPrs) {
      app.selectedPrs = JSON.parse(app.selectedPrs);
      if(app.selectedPrs.length == 0) {
        app.selectedPrs = [
          {tagid: pr_goods[0]}
        ];
        app.showCard({tagid: pr_goods[0]});
        app.saveSelectedPrs();
        return;
      }
      app.selectedPrs.forEach(function(pr) {
        app.showCard(pr);
      });
    } else {
      app.selectedPrs = [
        {tagid: pr_goods[0]}
      ];
      app.showCard({tagid: pr_goods[0]});
      app.saveSelectedPrs();
    }
  }

  function getData() {
    ajaxRequest(function (r) {
      if(r.result == "success") {
        saveLatestData(r);
        setCharts(r.chart1);
        setHighChart(r.chart2);
        setCards();
      }
    }, function() {
      var r = loadLatestData();
      if (r == null && r.result != "success") {
        pr_goods.forEach(function (goodpr) {
          $('#' + goodpr + '_price').text("네트워크 연결이 필요합니다.");
        });
      }
      else {
        setCharts(r.chart1);
        setHighChart(r.chart2);
      }
    });
  }

  function setHighChart(dataSet){
    pr_goods.forEach(function (goodpr) {
      setHighChartKind(dataSet, goodpr);
    });
  }

  function setHighChartKind(dataSet, kind) {
    var dayAr = ["일", "월", "화", "수", "목", "금", "토"];
    var ctx = document.getElementById("highchart-weekly-" + kind).getContext('2d');
    ctx.canvas.width = 300;
    ctx.canvas.height = 300;
    var myChart = new Chart(ctx, {
      type: 'bubble',
        data: {
          labels: dayAr,
          datasets: dataSet[kind]
        },
        options: {
          aspectRatio: 1,
    			legend: false,
          responsive: false,
          tooltips: {
          callbacks: {
                    label: function(tooltipItem, data) {
                        var d = data.datasets[tooltipItem.datasetIndex].data[0];
                        var t = d.c;

                        if (data.datasets[tooltipItem.datasetIndex].type == 'line')
                          return dayAr[tooltipItem.xLabel] + "요일의 평균가격: " + tooltipItem.yLabel + "원";

                        return dayAr[d.x] + "요일에 " + tooltipItem.yLabel + "원이었던 적이 " + t + "번 존재";
                    }
                }
            },
          scales: {
              xAxes: [{
                ticks: {
                  userCallback: function(label, index, labels) {
                    return dayAr[label];
                  }
                }
              }]
            },
          layout: {
            padding: {
                left: 20,
                right: 30,
                top: 20,
                bottom: 20
            }
          }
        }
    });
  }

  function setChartKind(kind, data, labelData) {
    var dta = data[kind];
    var chartDataSet = Array();
    var chartDayData = Array();
    var chartNightData = Array();

    dta.forEach(function (pr) {
        chartDayData.push(pr.d);
        chartNightData.push(pr.n);
    });

    chartDayData.reverse();
    chartNightData.reverse();
    chartDataSet[0] =
          {
            data: chartDayData,
            label: "오전",
            borderColor: "#6666cd",
            fill: true,
            steppedLine:true
          };

    chartDataSet[1] =
          {
            data: chartNightData,
            label: "오후",
            borderColor: "#3e95cd",
            fill: true,
            steppedLine:true
          };

    var ctx = document.getElementById("morris-area-chart-" + kind).getContext('2d');
    ctx.canvas.width = 300;
    ctx.canvas.height = 300;
    var myChart = new Chart(ctx, {
      type: 'line',
        data: {
          labels: labelData,
          datasets: chartDataSet
        },
        options: {
          aspectRatio: 1,
    			legend: false,
          responsive: false,
          tooltips: {
          callbacks: {
                    label: function(tooltipItem, data) {
                        var d = data.datasets[tooltipItem.datasetIndex].label;
                        return d + " 가격 " + tooltipItem.yLabel + "원";
                    }
                }
            },
          layout: {
              padding: {
                  left: 20,
                  right: 30,
                  top: 20,
                  bottom: 20
              }
            }
        }
    });
  }

  function checkIn(item) {
    for (var i = 0; i < pr_goods.length; ++i) {
      if(pr_goods[i] == item) return true;
    }

    return false;
  }

  var comma_separator_number_step = 3;

  function setCountPrice(target_id, price) {
    $(target_id)
    .prop('number', 10)
    .animateNumber(
      {
        number: price
      },
      2000
    );
  }

  var chartCount=0;
  function addChart(pr) {
    var item = '<div class="card cardTemplate capri-data" id="card_' + pr.tagid + '" hidden>';
    item += '<div style="text-align:right"><a href="#" id="card_' +pr.tagid+ '_close"><h4><font color=#aaa>닫기</font></h3></a></div>';
    item += '<h3><font color=#333>' + pr_goods_name_address[pr.tagid][0] + '</font></h3>';
    item += '<a href="' + pr_goods_name_address[pr.tagid][1] + '" target=_new><h2>';
    item += '<span id="' + pr.tagid + '_price">0</span>원</h2></a>';
    item += '<h5 class="recom">' + pr.text1 + '</h5>';
    item += '<h5 class="recom">' + pr.text2 +'</h5>';
    item += '<canvas id="morris-area-chart-' + pr.tagid + '" class="aligncenter"></canvas>';
    item += '<h4>' + pr_goods_name_address[pr.tagid][0] + '의 요일별 가격</h4>';
    item += '<canvas id="highchart-weekly-' + pr.tagid + '" class="aligncenter"></canvas>';

    item += '<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>';
    item += '<ins class="adsbygoogle" ';
    item += 'style="display:block" ';
    item += 'data-ad-client="ca-pub-5184861938684175" ';
    item += 'data-ad-slot="9839644428" data-ad-format="auto" data-full-width-responsive="true"></ins>';
    item += '<script>';
    item += '(adsbygoogle = window.adsbygoogle || []).push({});';
    item += '</script>';

    item += '</div>';

    $('#item_body').append(item);
    $('#selectPr').append('<option value="'+pr.tagid+'">' + pr_goods_name_address[pr.tagid][0] + '</option>');

    document.getElementById("card_" +pr.tagid+ "_close").addEventListener('click', function() {
      // Open/show the add new city dialog

      if (chartCount == 1) {
        alert("최소 1개 이상의 제품은 보셔야지요옷!")
        return;
      }

      app.removeCard(pr.tagid);
      for(var i=0;i<=(app.selectedPrs.length-1);i++){
        if(app.selectedPrs[i].tagid == pr.tagid){
            app.selectedPrs.splice(i,1);
            chartCount--;
            break;
        }
      }

      app.saveSelectedPrs();

    });
  }

  function setCharts(data) {
    $("#gather_date").text(data.gather_date);
    var labelData = data.labels.reverse();

    data.price_tags.forEach(function (pr) {
        if (checkIn(pr.tagid) == false) return;

        addChart(pr);

        if (pr.tagid == "orange")
          setCountPrice("#" + pr.tagid + "_price", pr.price);
        else
          $("#" + pr.tagid + "_price").text(pr.price);

        setChartKind(pr.tagid, data, labelData);
    });
  }


  function ajaxRequest(callback, errorcallback) {
      $.ajax({url : "https://ptbu18cv95.execute-api.ap-northeast-2.amazonaws.com/prod/caprisun/get",
             dataType : "json",
             crossDomain: true,
             cache : false,
             type : "GET",
             async: false,
             success : function(r) {
               console.log(JSON.stringify(r));
               callback(r);
             },
             error:function(request,status,error){
                 console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                 errorcallback();
             }
      });
  }

  // Toggles the visibility of the add new city dialog.
  app.toggleAddDialog = function(visible) {
    if (visible) {
      app.addDialog.classList.add('dialog-container--visible');
    } else {
      app.addDialog.classList.remove('dialog-container--visible');
    }
  };

  document.getElementById('butAdd').addEventListener('click', function() {
    // Open/show the add new city dialog
    app.toggleAddDialog(true);
  });

  document.getElementById('butAddPr').addEventListener('click', function() {
    // Add the newly selected city
    var select = document.getElementById('selectPr');
    var selected = select.options[select.selectedIndex];
    var key = selected.value;
    if (!app.selectedPrs) {
      app.selectedPrs = [];
    }

    app.selectedPrs.push({tagid: key});
    app.saveSelectedPrs();
    app.showCard({tagid: key});
    app.toggleAddDialog(false);
    alert("추가 되었습니다. 저 아래로 스크롤해서 확인해 보세요^^");
  });

  // TODO add saveSelectedCities function here
 // Save list of cities to localStorage.
 app.saveSelectedPrs = function() {
   var selectedPrs = JSON.stringify(app.selectedPrs);
   localStorage.selectedPrs = selectedPrs;
 };

 app.showCard = function(pr) {
   var card = $("#card_" + pr.tagid);
   if (card) {
     card.removeAttr('hidden');
     card.show();
     chartCount++;
   }
 };

 app.removeCard = function(tagid) {
   var card = $("#card_" + tagid);
   if (card) {
     card.attr('hidden');
     card.hide();
   }
 };

  document.getElementById('butAddCancel').addEventListener('click', function() {
      // Close the add new city dialog
    app.toggleAddDialog(false);
  });

  getData();
})();
