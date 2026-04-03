/**
 * Calculator logic for "Tính khối lượng mái ngói"
 * Handles dynamic area blocks, rectangle/trapezoid calculations, and wastage factors.
 */

export const initCalculator = () => {
    const calculatorSection = document.querySelector('section.bg-background-secondary');
    if (!calculatorSection) return;

    const areasContainer = calculatorSection.querySelector('.space-y-6.col-span-1.lg\\:col-span-3');
    if (!areasContainer) return;

    // Find Area 2 to use as Master Template (it has 3 inputs and Remove button)
    const allInitialBlocks = Array.from(areasContainer.children).filter(el => 
        el.classList.contains('flex') && 
        el.querySelector('span')?.textContent.includes('DIỆN TÍCH')
    );
    
    // Use the one with most inputs as template, or the second one specifically if possible
    const masterTemplate = (allInitialBlocks.find(b => b.querySelectorAll('input').length === 3) || allInitialBlocks[0])?.cloneNode(true);

    const buttons = areasContainer.querySelectorAll('button');
    const addAreaBtn = Array.from(buttons).find(btn => btn.textContent.includes('+ Thêm diện tích'));
    const calculateBtn = Array.from(buttons).find(btn => btn.textContent.includes('TÍNH TOÁN KHỐI LƯỢNG'));

    const resultRows = calculatorSection.querySelectorAll('.space-y-4 .grid.grid-cols-12');
    const resultTilesAm = resultRows[0];
    const resultTilesDuong = resultRows[1];
    const resultDiem = resultRows[2];

    const extraLossCheckbox = document.getElementById('extra-loss');
    const lossRadios = document.querySelectorAll('input[name="loss-rate"]');

    const roofStyleSelect = document.getElementById('roof-style');
    const tileTypeSelect = document.getElementById('tile-type');

    const vnFormatter = new Intl.NumberFormat('vi-VN');
    const format = (num) => vnFormatter.format(num);

    const getAreaBlocks = () => {
        const blocks = Array.from(areasContainer.children).filter(el => 
            el.classList.contains('flex') && 
            el.querySelector('span')?.textContent.includes('DIỆN TÍCH')
        );
        return blocks;
    };

    const updateCoeffLabels = () => {
        if (!tileTypeSelect) return;
        const selectedTile = tileTypeSelect.options[tileTypeSelect.selectedIndex];
        if (!selectedTile || selectedTile.value === "") {
            if (resultTilesAm) resultTilesAm.querySelectorAll('span')[2].textContent = `-- viên/m²`;
            if (resultTilesDuong) resultTilesDuong.querySelectorAll('span')[2].textContent = `-- viên/m²`;
            if (resultDiem) resultDiem.querySelectorAll('span')[2].textContent = `-- cặp/md`;
            return;
        }

        const amCoeff = parseFloat(selectedTile.dataset.am) || 40;
        const duongCoeff = parseFloat(selectedTile.dataset.duong) || 27;
        const diemCoeff = parseFloat(selectedTile.dataset.diem) || 5;

        if (resultTilesAm) {
            const coeffSpan = resultTilesAm.querySelectorAll('span')[2];
            if (coeffSpan) coeffSpan.textContent = `${amCoeff} viên/m²`;
        }
        if (resultTilesDuong) {
            const coeffSpan = resultTilesDuong.querySelectorAll('span')[2];
            if (coeffSpan) coeffSpan.textContent = `${duongCoeff} viên/m²`;
        }
        if (resultDiem) {
            const coeffSpan = resultDiem.querySelectorAll('span')[2];
            if (coeffSpan) coeffSpan.textContent = `${diemCoeff} cặp/md`;
        }
    };

    const updateResults = () => {
        let totalS = 0;
        let totalL = 0;

        const blocks = getAreaBlocks();
        blocks.forEach(block => {
            const select = block.querySelector('select');
            const inputs = Array.from(block.querySelectorAll('input')).filter(i => i.closest('.relative')?.parentElement.style.display !== 'none');
            const type = select.value || select.options[select.selectedIndex].text;
            
            let S = 0;
            let L = 0;

            if (type.includes('CHỮ NHẬT')) {
                const dai = parseFloat(inputs[0]?.value) || 0;
                const rong = parseFloat(inputs[1]?.value) || 0;
                S = dai * rong;
                L = dai;
            } else if (type.includes('THANG')) {
                const dayLon = parseFloat(inputs[0]?.value) || 0;
                const dayBe = parseFloat(inputs[1]?.value) || 0;
                const cao = parseFloat(inputs[2]?.value) || 0;
                S = ((dayLon + dayBe) * cao) / 2;
                L = dayLon;
            }

            totalS += S;
            totalL += L;
        });

        let factor = 1.0;
        if (extraLossCheckbox && extraLossCheckbox.checked) {
            const checkedRadio = Array.from(lossRadios).find(r => r.checked);
            if (checkedRadio) {
                const label = checkedRadio.closest('label')?.textContent || '';
                if (label.includes('15%')) factor = 1.15;
                else if (label.includes('20%')) factor = 1.2;
            }
        }

        // If not selected, show zeros or placeholders but don't error out
        const styleFactor = (roofStyleSelect && roofStyleSelect.value !== "") 
            ? parseFloat(roofStyleSelect.options[roofStyleSelect.selectedIndex].dataset.factor) || 1.0 
            : 0;
        
        factor *= styleFactor;

        // Update Labels
        updateCoeffLabels();

        // Get Tile Coefficients for math
        const selectedTile = tileTypeSelect?.options[tileTypeSelect.selectedIndex];
        const amCoeff = (selectedTile && selectedTile.value !== "") ? parseFloat(selectedTile.dataset.am) || 0 : 0;
        const duongCoeff = (selectedTile && selectedTile.value !== "") ? parseFloat(selectedTile.dataset.duong) || 0 : 0;
        const diemCoeff = (selectedTile && selectedTile.value !== "") ? parseFloat(selectedTile.dataset.diem) || 0 : 0;

        const ngoiAm = Math.ceil(totalS * amCoeff * factor);
        const ngoiDuong = Math.ceil(totalS * duongCoeff * factor);
        const diem = Math.ceil(totalL * diemCoeff * factor);

        if (resultTilesAm) {
            resultTilesAm.querySelectorAll('span')[1].textContent = `${format(totalS)} m²`;
            resultTilesAm.querySelectorAll('span')[3].textContent = `${format(ngoiAm)} viên`;
        }
        if (resultTilesDuong) {
            resultTilesDuong.querySelectorAll('span')[1].textContent = `${format(totalS)} m²`;
            resultTilesDuong.querySelectorAll('span')[3].textContent = `${format(ngoiDuong)} viên`;
        }
        if (resultDiem) {
            resultDiem.querySelectorAll('span')[1].textContent = `${format(totalL)} md`;
            resultDiem.querySelectorAll('span')[3].textContent = `${format(diem)} cặp`;
        }
    };

    const handleTypeChange = (block) => {
        const select = block.querySelector('select');
        const type = select.value || select.options[select.selectedIndex].text;
        const inputGrid = block.querySelector('.grid-cols-12');
        const inputWrappers = Array.from(inputGrid.children);

        if (type.includes('CHỮ NHẬT')) {
            // Label 1
            const label1 = inputWrappers[1]?.querySelector('label');
            if (label1) label1.innerHTML = `CHIỀU DÀI <span class="block text-[12px] font-normal italic lowercase text-secondary/70">Chiều tính diềm mái</span>`;
            inputWrappers[1]?.classList.replace('md:col-span-3', 'md:col-span-3'); // Stay same or adjust
            inputWrappers[1]?.classList.replace('col-span-4', 'col-span-6');

            // Label 2
            const label2 = inputWrappers[2]?.querySelector('label');
            if (label2) label2.innerHTML = `CHIỀU RỘNG <span class="block text-[12px] opacity-0">-</span>`;
            inputWrappers[2]?.classList.replace('md:col-span-3', 'md:col-span-3');
            inputWrappers[2]?.classList.replace('col-span-4', 'col-span-6');

            // Hide 3rd
            if (inputWrappers[3]) inputWrappers[3].style.display = 'none';
        } else if (type.includes('THANG')) {
            // Label 1
            const label1 = inputWrappers[1]?.querySelector('label');
            if (label1) label1.innerHTML = `ĐÁY LỚN <span class="block text-[12px] font-normal italic lowercase text-secondary/70">Chiều tính diềm mái</span>`;
            inputWrappers[1]?.classList.replace('col-span-6', 'col-span-4');

            // Label 2
            const label2 = inputWrappers[2]?.querySelector('label');
            if (label2) label2.innerHTML = `ĐÁY BÉ <span class="block text-[12px] opacity-0">-</span>`;
            inputWrappers[2]?.classList.replace('col-span-6', 'col-span-4');

            // Show 3rd
            if (inputWrappers[3]) {
                inputWrappers[3].style.display = 'block';
                inputWrappers[3]?.classList.replace('col-span-6', 'col-span-4');
                const label3 = inputWrappers[3].querySelector('label');
                if (label3) label3.innerHTML = `CHIỀU CAO <span class="block text-[12px] opacity-0">-</span>`;
            }
        }
        // updateResults(); // Removed from here: don't auto-calculate on shape change
    };

    const renumberAreas = () => {
        getAreaBlocks().forEach((block, index) => {
            const titleSpan = block.querySelector('span.tracking-widest');
            if (titleSpan) titleSpan.textContent = `DIỆN TÍCH ${index + 1}`;
        });
    };

    const setupListeners = (block) => {
        block.querySelectorAll('input').forEach(input => {
            // input.addEventListener('input', updateResults); // Removed: only on button click
        });
        const select = block.querySelector('select');
        if (select) {
            select.addEventListener('change', () => handleTypeChange(block));
            // Trigger initial UI state
            handleTypeChange(block);
        }
        
        const removeBtn = block.querySelector('button.underline');
        if (removeBtn && removeBtn.textContent.includes('Loại bỏ')) {
            removeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                block.remove();
                renumberAreas();
                updateResults();
            });
        }
    };

    const addArea = () => {
        if (!masterTemplate) return;
        const newBlock = masterTemplate.cloneNode(true);
        
        // Clear inputs
        newBlock.querySelectorAll('input').forEach(input => input.value = '');

        // Add to DOM before the buttons
        const triggerDiv = addAreaBtn.parentElement;
        triggerDiv.before(newBlock);

        renumberAreas();
        setupListeners(newBlock);
        // updateResults(); // Removed: only on button click
    };

    // Initial Setup
    getAreaBlocks().forEach(setupListeners);

    if (addAreaBtn) {
        addAreaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addArea();
        });
    }

    if (calculateBtn) {
        calculateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            updateResults();
        });
    }

    if (extraLossCheckbox) {
        extraLossCheckbox.addEventListener('change', updateResults);
    }

    lossRadios.forEach(radio => {
        radio.addEventListener('change', updateResults);
    });

    const checkButtonState = () => {
        if (!calculateBtn) return;
        const isStyleSelected = roofStyleSelect && roofStyleSelect.value !== "";
        const isTileSelected = tileTypeSelect && tileTypeSelect.value !== "";
        
        if (isStyleSelected && isTileSelected) {
            calculateBtn.disabled = false;
            calculateBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
            calculateBtn.disabled = true;
            calculateBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    };

    if (roofStyleSelect) {
        roofStyleSelect.addEventListener('change', () => {
            checkButtonState();
            // updateResults(); // Only for wastage
        });
    }

    if (tileTypeSelect) {
        tileTypeSelect.addEventListener('change', () => {
            updateCoeffLabels();
            checkButtonState();
        });
    }

    checkButtonState();
    updateResults();
};
