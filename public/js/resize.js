function resizeWindow() {
  //Responsiveness for annotation box
  if (
    window.screen.width * window.devicePixelRatio < 1920 &&
    window.screen.height * window.devicePixelRatio < 1080
  ) {
    $('#annotation-box').css({
      bottom: '1vh',
      transform: 'scale(0.7)',
    });
  }
  if (window.matchMedia('(max-width: 1500px)').matches) {
    $('#peaks-container > wave').css({ height: '65vw' });
    $('#annotation-box').css({
      'box-shadow': '4px 4px 4px #888888',
      bottom: '3rem',
      right: '0.1rem',
      border: '1px solid grey',
      width: '370px',
      position: 'fixed',
      'z-index': '3',
      'background-color': 'white',
      'overflow-x': 'hidden',
      'overflow-y': 'hidden',
      display: 'none',
    });

    //canvas height to set the top speaker annotation div position from left
    canvasHeight = $('#peaks-container > wave canvas').height();

    $('#plus-button').css({
      marginLeft: `65vw`,
    });

    $('#submit-button').css({
      bottom: `0.5rem`,
    });
    $('#profile-link-button').css({
      bottom: `0.5rem`,
    });

    $('#time-line').css({
      transform: `translate(0px,${$('wave').height() - 10}px)`,
    });

    $('#top-div-speaker-control').css({
      right: '0.1rem',
      width: '300px',
    });

    $('#v-container').css({
      'margin-top': '-65vh',
    });

    $('#plus-button').css({
      marginTop: `calc(${
        $('#peaks-container > wave > wave').offset().top
      }px + ${$('#peaks-container > wave > wave').width()}px - 10px)`,
    });

    //$("#annotation-div-head").css({
    //  "left": `${canvasHeight}px`
    //})

    seekToCookie();

    /* The viewport is less than, or equal to, 1500 pixels wide */
  } else if (window.matchMedia('(min-width: 1500px)').matches) {
    $('#peaks-container > wave').css({ height: '55vw' });
    $('#annotation-box').css({
      'box-shadow': '4px 4px 4px #888888',
      bottom: '2rem',
      right: '10rem',
      border: '1px solid grey',

      position: 'fixed',
      'z-index': '3',
      'background-color': 'white',
      'overflow-x': 'hidden',
      'overflow-y': 'hidden',
      display: 'none',
    });

    //canvas height to set the top speaker annotation div position from left
    canvasHeight = $('#peaks-container > wave canvas').height();

    $('#plus-button').css({
      marginLeft: `56vw`,
    });
    $('#submit-button').css({
      bottom: `2rem`,
    });
    $('#profile-link-button').css({
      bottom: `1rem`,
    });

    $('#time-line').css({
      transform: `translate(0px,${$('wave').height() - 10}px)`,
    });

    $('#top-div-speaker-control').css({
      right: '2rem',
      width: '300px',
    });
    $('#v-container').css({
      'margin-top': '-50vh',
    });

    $('#plus-button').css({
      marginTop: `calc(${
        $('#peaks-container > wave > wave').offset().top
      }px + ${$('#peaks-container > wave > wave').width()}px - 10px)`,
    });

    seekToCookie();
  }
}

function resizeTransperfectScreen() {
  //Calculating Annotation Box height for Transperfect
  const annotationBoxHeight =
    document.documentElement.clientHeight -
    $('#top-block').height() -
    $('#top-header').height() +
    11;
  if (window.matchMedia('(max-width: 1500px)').matches) {
    $('#peaks-container > wave').css({ height: '35vw' });
    // $('#annotation-box').css({
    //   'box-shadow': '4px 4px 4px #888888',
    //   marginLeft: '40vw',
    //   height: `${annotationBoxHeight}px`,
    //   border: '1px solid grey',
    //   position: 'fixed',
    //   'z-index': '3',
    //   'background-color': 'white',
    //   'overflow-x': 'hidden',
    //   'overflow-y': 'hidden',
    //   display: 'none',
    // });
    //canvas height to set the top speaker annotation div position from left
    canvasHeight = $('#peaks-container > wave canvas').height();

    $('#plus-button').css({
      marginLeft: `35vw`,
    });

    $('#submit-button').css({
      bottom: `0.5rem`,
    });
    $('#profile-link-button').css({
      bottom: `0.5rem`,
    });

    $('#time-line').css({
      transform: `translate(0px,${$('wave').height() - 10}px)`,
    });

    $('#top-div-speaker-control').css({
      right: '0.1rem',
      width: '300px',
    });

    $('#v-container').css({
      'margin-top': '-20vh',
    });

    $('#plus-button').css({
      marginTop: `calc(${
        $('#peaks-container > wave > wave').offset().top
      }px + ${$('#peaks-container > wave > wave').width()}px - 10px)`,
    });

    $('#guidelines-box').css({
      top: '13vh',
    });

    $('.video-js').css({
      height: '400px',
    });
    //$("#annotation-div-head").css({
    //  "left": `${canvasHeight}px`
    //})

    seekToCookie();

    /* The viewport is less than, or equal to, 1500 pixels wide */
  } else if (window.matchMedia('(min-width: 1500px)').matches) {
    $('#peaks-container > wave').css({ height: '35vw' });
    // $('#annotation-box').css({
    //   'box-shadow': '4px 4px 4px #888888',
    //   marginLeft: '40vw',
    //   bottom: 0,
    //   height: `${annotationBoxHeight}px`,
    //   border: '1px solid grey',
    //   'border-left': '2px solid black',
    //   'border-right': '2px solid black',
    //   'border-top': '2px solid black',
    //   position: 'fixed',
    //   'z-index': '3',
    //   'background-color': 'white',
    //   'overflow-x': 'hidden',
    //   'overflow-y': 'hidden',
    //   display: 'none',
    // });

    //canvas height to set the top speaker annotation div position from left
    canvasHeight = $('#peaks-container > wave canvas').height();

    $('#plus-button').css({
      marginLeft: `35vw`,
    });
    $('#submit-button').css({
      bottom: `2rem`,
    });
    $('#profile-link-button').css({
      bottom: `1rem`,
    });

    $('#time-line').css({
      transform: `translate(0px,${$('wave').height() - 10}px)`,
    });

    $('#top-div-speaker-control').css({
      right: '2rem',
      width: '300px',
    });
    $('#v-container').css({
      'margin-top': '-20vh',
    });

    $('#plus-button').css({
      marginTop: `calc(${
        $('#peaks-container > wave > wave').offset().top
      }px + ${$('#peaks-container > wave > wave').width()}px - 10px)`,
    });

    $('#guidelines-box').css({
      top: '16vh',
    });

    $('.video-js').css({
      height: '500px',
    });
    seekToCookie();
  }
}
