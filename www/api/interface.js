
// RICH DROPDOWN BOXES
// ========================================================================================================

   // BUILD DROPDOWN FROM GIVEN LIST
   // -------------------------------------------------------------------------
      window.combo = function(lst)
      {
         var cmbObj = window.event.srcElement.parentNode;
         var tgtNde = cmbObj.getElementsByClassName('combo-txt');
             tgtNde = [].slice.call(tgtNde);
             tgtNde = tgtNde[0];

         var lstObj = document.createElement('div');

         lstObj.style.width = (cmbObj.offsetWidth -4)+'px';
         lstObj.style.maxHeight = '10em';
         lstObj.style.minHeight = '1em';
         lstObj.className = 'combo-lst';

         for (var itm in lst)
         {
            var lstItm = document.createElement('div');
            lstItm.className = 'combo-itm';
            lstItm.value = lst[itm];

            lstItm.innerHTML = lst[itm];

            lstItm.onmousedown = function()
            {
               tgtNde.value = this.value;
               showOnly(this.value);
            };

            var lstIco = document.createElement('div');
            lstIco.className = (function()
            {
               if (tgtNde.value == lst[itm])
               { return 'inline float-right icon-ok show'; }
               else
               { return 'inline float-right icon-ok hide'; }
            }());

            lstItm.appendChild(lstIco);
            lstObj.appendChild(lstItm);
         }

         cmbObj.appendChild(lstObj);
         cmbObj.focus();
      };
   // -------------------------------------------------------------------------


   // DROPDOWN RESET FUNCTION
   // -------------------------------------------------------------------------
      function resetDropLists()
      {
         var nds = document.getElementsByClassName('combo-lst');
         nds = [].slice.call(nds);

         nds.forEach(function(i,k,a)
         {
            i.parentNode.removeChild(i);
         });
      }
   // -------------------------------------------------------------------------


   // RESET DROPDOWN ON GLOBAL MOUSE-UP EVENT
   // -------------------------------------------------------------------------
      document.onmouseup = function()
      {
         resetDropLists();
      };
   // -------------------------------------------------------------------------


   // RESET DROPDOWN ON WINDOW RESIZE
   // -------------------------------------------------------------------------
      window.onresize = function()
      {
         resetDropLists();
      };
   // -------------------------------------------------------------------------

// ========================================================================================================



// GET CONTACT LIST DATA FROM JSON
// ========================================================================================================
   function getContacts()
   {
      var ctx = document.getElementById("ctxLst");
      var xhr = new XMLHttpRequest();
      var src = 'api/data.json';
      var jsn = null;

      var result = document.createElement('table');
      var status = {1:'busy', 2:'away', 3:'open'};

      var evnOdd = function(nbr)
      {
         if (((nbr /2)+'').indexOf('.') > 0)
         { return 'odd'; }
         else
         { return 'evn'; }
      };

      result.className = 'stretch';

      ctx.innerHTML = 'One moment please...';

      xhr.open('GET', src, false);
      xhr.send(null);

      try
      { jsn = JSON.parse(xhr.response); }
      catch(e)
      {
         ctx.innerHTML = 'ParseError: invalid JSON data';
         return;
      }

      for (var i in jsn)
      {
         var itmRow = document.createElement('tr');

         var stsCol = document.createElement('td');
         var nmeCol = document.createElement('td');
         var sepCol = document.createElement('td');
         var dfnCol = document.createElement('td');

         var sepDiv = document.createElement('div');
         var emlOpt = document.createElement('span');
         var pneOpt = document.createElement('span');

         itmRow.className = 'sepr-h row-'+evnOdd(i);

         stsCol.className = "icon-circle led-"+status[jsn[i]['status']];
         nmeCol.className = 'align-left';
         dfnCol.className = 'align-left soft';

         sepDiv.className = 'sepr-v';
         emlOpt.className = 'emlOpt show';
         pneOpt.className = 'pneOpt hide';

         nmeCol.innerHTML = jsn[i]['name'];
         emlOpt.innerHTML = jsn[i]['email'];
         pneOpt.innerHTML = jsn[i]['phone'];

         sepCol.appendChild(sepDiv);
         dfnCol.appendChild(emlOpt);
         dfnCol.appendChild(pneOpt);

         itmRow.appendChild(stsCol);
         itmRow.appendChild(nmeCol);
         itmRow.appendChild(sepCol);
         itmRow.appendChild(dfnCol);

         result.appendChild(itmRow);
      }

      ctx.innerHTML = '';

      ctx.appendChild(result);
   };
// ========================================================================================================



// SHOW ONLY DETAILS BY SELECTED OPTION
// ========================================================================================================
   function showOnly(kwd)
   {
      var opt = {'Email Address':'emlOpt', 'Phone Number':'pneOpt'};
      var cls = 'emlOpt show,pneOpt show'.split(',');
      var tgt = opt[kwd];
      var nds = null;

      for (var i in cls)
      {
         nds = document.getElementsByClassName(cls[i]);
         nds = [].slice.call(nds);

         if (nds.length > 0)
         {
            for (var n in nds)
            { nds[n].className = (nds[n].className.replace('show', 'hide')); }
         }
      }

      nds = document.getElementsByClassName(tgt+' hide');
      nds = [].slice.call(nds);

      for (var n in nds)
      { nds[n].className = tgt+' show'; }
   }
// ========================================================================================================



// WHEN DOM HAS LOADED POPULATE THE CONTEXT
// ========================================================================================================
   window.addEventListener("load", function load(event)
   {
      window.removeEventListener("load", load, false);

      getContacts();
   },false);
// ========================================================================================================
