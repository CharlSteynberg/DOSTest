
// RICH DROPDOWN BOXES
// ========================================================================================================

   // BUILD DROPDOWN FROM GIVEN LIST
   // -------------------------------------------------------------------------
      window.combo = function(lst, cbf)
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
            lstItm.data = itm;

            lstItm.innerHTML = lst[itm];

            lstItm.onmousedown = function()
            {
               tgtNde.value = this.value;
               tgtNde.data = this.data;
               cbf(this.data, this.value);
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



// CONTACTS OBJECT || CLASS
// ========================================================================================================
   window.contacts = // object
   {
   // COLOURED DOT AS STATUS
   // -------------------------------------------------------------------------
      iconStatus:{1:'busy', 2:'away', 3:'open'},
   // -------------------------------------------------------------------------


   // FOR EVEN OR ODD ROWS
   // -------------------------------------------------------------------------
      getEvenOdd:function(nbr)
      {
         if (((nbr /2)+'').indexOf('.') > 0)
         { return 'odd'; }
         else
         { return 'evn'; }
      },
   // -------------------------------------------------------------------------


   // SHOW ONLY EMAIL OR PHONE NUMBERS :: FOR DROP-DOWN MENU
   // -------------------------------------------------------------------------
      toggleShow:function(cls, val)
      {
         var opt = {'Email Address':'emlOpt', 'Phone Number':'pneOpt'};
         var nds = null;

         for (var i in opt)
         {
            nds = document.getElementsByClassName(opt[i]);
            nds = [].slice.call(nds);

            if (nds.length > 0)
            {
               for (var n in nds)
               { nds[n].className = nds[n].className+' soft hide'; }
            }
         }

         nds = document.getElementsByClassName(cls);
         nds = [].slice.call(nds);

         for (var n in nds)
         { nds[n].className = cls+' soft show'; }
      },
   // -------------------------------------------------------------------------


   // GET CONTACTS FROM JSON DATA AND BUILD LIST ON GUI
   // -------------------------------------------------------------------------
      importList:function()
      {
      // GET TARGET ELEMENT AND HTML TEMPLATE FROM HTML
      // ----------------------------------------------------------------------
         var ctxLst = document.getElementById("ctxLst");
         var htmSrc = document.getElementById("htmSrc").innerHTML;
      // ----------------------------------------------------------------------


      // GET JSON DATA
      // ----------------------------------------------------------------------
         ctxLst.innerHTML = 'One moment please...';

         var src = 'api/data.json';
         var jsn = null;

         var xhr = new XMLHttpRequest();
             xhr.open('GET', src, false);
             xhr.send(null);

         try
         { jsn = JSON.parse(xhr.response); }
         catch(e)
         {
            console.log('ParseError: invalid JSON data');
            return;
         }
      // ----------------------------------------------------------------------


      // BUILD LIST FROM DATA & MODIFY TEMPLATE FOR EACH ITEM
      // ----------------------------------------------------------------------
         ctxLst.innerHTML = '';

         for (var i in jsn)
         {
            var ctxRow = document.createElement('div');
            var rowHtm = htmSrc+'';
            var clData = jsn[i];

            clData['evnOdd'] = contacts.getEvenOdd(i);
            clData['status'] = contacts.iconStatus[clData['status']];

            ctxRow.className = 'ctx-row';

            if (!clData['pstl_code'])
            { clData['pstl_code'] = '<i class="soft">undefined&nbsp;</i>'; }

            for (var fld in clData)
            {
               rowHtm = rowHtm.split('{clData.'+fld+'}').join(clData[fld]);
            }

            ctxRow.innerHTML = rowHtm;

            ctxRow.onclick = function()
            { contacts.showDetail(this); }

            ctxLst.appendChild(ctxRow);
         }
      // ----------------------------------------------------------------------
      },
   // -------------------------------------------------------------------------


   // EXPAND DETAILS ON FOCUS
   // -------------------------------------------------------------------------
      showDetail:function(tgt)
      {
         var nds = document.getElementsByClassName('ctx-row');
         nds = [].slice.call(nds);

         if (tgt.className != 'ctx-row')
         { tgt = tgt.parentNode.parentNode.parentNode; }

         var tglObj = document.getElementById('toggleShow');
         var tglOpt = tglObj.data;

         if (!tglOpt)
         { tglOpt = tglObj.getAttribute('data'); }

         for (var n in nds)
         {
            nds[n].style.opacity = 0.36;
            nds[n].style.zIndex=1;
            nds[n].style.overflow='hidden';

            nds[n].getElementsByClassName(tglOpt)[0].className = tglOpt+' soft show';
            nds[n].getElementsByClassName('emlDtl')[0].className = 'emlDtl hide';
         }

         tgt.style.opacity = 1;
         tgt.style.zIndex=999;
         tgt.style.overflow='visible';

         tgt.getElementsByClassName(tglOpt)[0].className = tglOpt+' hide';
         tgt.getElementsByClassName('emlDtl')[0].className = 'emlDtl show';
      },
   // -------------------------------------------------------------------------


   // HIDE DETAILS
   // -------------------------------------------------------------------------
      hideDetail:function()
      {
         var nds = document.getElementsByClassName('ctx-row');
         nds = [].slice.call(nds);

         var tglObj = document.getElementById('toggleShow');
         var tglOpt = tglObj.data;

         if (!tglOpt)
         { tglOpt = tglObj.getAttribute('data'); }

         for (var n in nds)
         {
            nds[n].style.opacity = 1;
            nds[n].style.zIndex=1;
            nds[n].style.overflow='hidden';

            nds[n].getElementsByClassName(tglOpt)[0].className = tglOpt+' soft show';
            nds[n].getElementsByClassName('emlDtl')[0].className = 'emlDtl hide';
         }
      }
   // -------------------------------------------------------------------------
   };

// ========================================================================================================



// WHEN DOM HAS LOADED POPULATE THE CONTEXT
// ========================================================================================================
   window.addEventListener("load", function load(event)
   {
      window.removeEventListener("load", load, false);

      contacts.importList();
   },false);
// ========================================================================================================
