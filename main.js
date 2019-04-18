var devideID;

$(document).ready(function() {
	$.ajax({
      method: 'POST',
      url: 'http://localhost:9002/api/mtscrahost/RequestDeviceList',
      data: {
        'WaitTime': 10,
        'ConnectionType': 4,
      },
      success: function (result) {
        console.log('success', result)
        devideID = result.DeviceList[0].Value;
      },
      error: function(result) {
        console.log('error', result)
      }
    });
})


function doSwipe() {
  return new Promise( (resolve, reject) => {
    $('#swipeBtn').get(0).disabled=true;
    $.ajax({
      method: 'POST',
      url: 'http://localhost:9002/api/mtscrahost/RequestCardSwipe',
      data: {
        'WaitTime': 10,
        'ConnectionType': 4,
        'DeviceID': devideID,
      },
      success: function (result) {
        console.log('success', result)
        
        $('#swipeBtn').get(0).disabled=false;
        $('#swipeBtnWr').hide();
        $('#swipeResultWr').show();
                
        $('#swipeResult').val(JSON.stringify(result.CardSwipeOutput, undefined, 4));
        $('#last4').html(result.CardSwipeOutput.CardLast4);
        $('#ccName').html(result.CardSwipeOutput.CardName);
        resolve();
      },
      error: function(result) {
        console.log('error', result)
        $('#swipeBtn').get(0).disabled=false;
        $('#dipRequestWr').hide();
        $("#error").show();
      }
    });
  });
}

function requestDIP() {
  return new Promise( (resolve, reject) => {
    $("#swipeResultWr").hide();
    $('#dipRequestWr').show();
    $.ajax({
      method: 'POST',
      url: 'http://localhost:9002/api/mtscrahost/RequestSmartCard',
      data: {
          'WaitTime': 20,
          'ConnectionType': 4,
          'DeviceID': devideID,
          'TransactionType': '0x00',
          'CardType': 3,
          'Amount': 10,
          'CashBack': 0,
          'CurrencyCode': '0840',
          'ReportOptions': 2,
          'Options': 0
      },
      success: function (result) {
        console.log('success', result)
        $('#dipResultWr').show();
        $('#dipRequestWr').hide();
        collectInit(JSON.stringify(result));
        resolve();
      },
      error: function(result) {
        console.log('error', result)
        $('#swipeBtn').get(0).disabled=false;
        $('#dipRequestWr').hide();
        $("#error").show();
      }
    });
  });
}

function requestSwipe() {
  doSwipe();
}

function collectInit (cardData) {
  var f = VgForm.create('tntjelgjqav', function (state) {});

  const secret = f.field('#cardData .fake-input', {
    type: 'textarea',
    name: 'secret',
    defaultValue: cardData,
    validations: ['required']
  });
  
  document.getElementById('ccForm').addEventListener('submit', function(e) {
    e.preventDefault();
    f.submit('/post', {
    }, function(status, data) {
      $('#collectResultWr').show();
      $('#dipResultWr').hide();
      $('#collectResult').html(JSON.stringify(data.json.secret, null, '  '));
    });
  }, false);
};