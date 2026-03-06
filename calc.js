(function(){
      const expressionEl = document.getElementById('expression');
      const resultEl = document.getElementById('result');
      let expr = '';

      function update() {
        expressionEl.textContent = expr || '';
      }

      function calculate() {
        try {
          const safe = sanitize(expr);
          if(safe === '') {
            resultEl.textContent = '';
            return;
          }
          const val = evaluateSafe(safe);
          resultEl.textContent = String(val);
              
        } catch(e) {
          resultEl.textContent = 'Erro';
        }
      }

      function sanitize(s){
        if(!s) return '';
        s = s.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');
        if(!/^[-+*/(). 0-9]*$/.test(s)) throw new Error('caractere inválido');
        return s;
      }

      function evaluateSafe(s){
        let depth = 0;
        for(const ch of s){
          if(ch==='(') depth++;
          if(ch===')') depth--;
          if(depth<0) throw new Error('parênteses não balanceados');
        }
        if(depth !== 0) throw new Error('parênteses não balanceados');
        if(s.length > 200) throw new Error('expressão muito longa');
        return Function('return (' + s + ')')();
      }

      document.querySelectorAll('button.key').forEach(b=>{
        b.addEventListener('click', ()=>{
          const v = b.dataset.value;
          const a = b.dataset.action;
          
          if(a === 'clear') { 
            expr = ''; 
            resultEl.textContent = '';
            update(); 
            return; 
          }
          if(a === 'back') { 
            expr = expr.slice(0,-1); 
            update(); 
            return; 
          }
          if(a === 'equal') {
            calculate();
            return;
          }
          if(v !== undefined){ 
            expr += v; 
            update(); 
          }
        })
      })

      window.addEventListener('keydown', (ev)=>{
        const key = ev.key;
        if(key === 'Enter'){ 
          ev.preventDefault(); 
          calculate();
          return; 
        }
        if(key === 'Escape'){ 
          expr=''; 
          resultEl.textContent = '';
          update(); 
          return; 
        }
        if(key === 'Backspace'){ expr = expr.slice(0,-1); update(); return }
        if(/^[0-9]$/.test(key) || key === '.') { expr += key; update(); return }
        if(key === '+' || key === '-' || key === '*' || key === '/' || key === '(' || key === ')'){ 
          expr += key; 
          update(); 
          return; 
        }
      })

      update();

    })();
