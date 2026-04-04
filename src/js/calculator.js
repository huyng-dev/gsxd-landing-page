/**
 * Calculator logic for "Tính khối lượng mái ngói"
 * Handles dynamic area blocks, rectangle/trapezoid calculations, and wastage factors.
 */

export const initCalculator = () => {
  const roofStyleSelect = document.getElementById("roof-style");
  const tileTypeSelect = document.getElementById("tile-type");

  const calculatorSection = roofStyleSelect?.closest("section") || document.querySelector("section.bg-background-secondary");
  if (!calculatorSection) return;

  const areasContainer = calculatorSection.querySelector(".space-y-4.col-span-1.lg\\:col-span-3");
  if (!areasContainer) return;

  // Find Area 2 to use as Master Template (it has 3 inputs and Remove button)
  const allInitialBlocks = Array.from(areasContainer.children).filter(
    (el) => el.classList.contains("flex") && el.querySelector("span")?.textContent.includes("DIỆN TÍCH"),
  );

  // Always prefer a block that already has a remove button as clone template.
  const masterTemplate = (
    allInitialBlocks.find((b) => {
      const removeBtn = b.querySelector("button.underline");
      return removeBtn && removeBtn.textContent.includes("Loại bỏ");
    }) || allInitialBlocks[allInitialBlocks.length - 1]
  )?.cloneNode(true);

  const buttons = areasContainer.querySelectorAll("button");
  const addAreaBtn = Array.from(buttons).find((btn) => btn.textContent.includes("+ Thêm diện tích"));
  const calculateBtn = Array.from(buttons).find((btn) => btn.textContent.includes("TÍNH TOÁN KHỐI LƯỢNG"));

  const resultRows = calculatorSection.querySelectorAll(".pt-8 .space-y-4 > .grid.grid-cols-12");
  const resultTilesAm = resultRows[0];
  const resultTilesDuong = resultRows[1];
  const resultDiem = resultRows[2];

  const extraLossCheckbox = calculatorSection.querySelector("#extra-loss");
  const lossRadios = calculatorSection.querySelectorAll('input[name="loss-rate"]');

  const vnFormatter = new Intl.NumberFormat("vi-VN");
  const format = (num) => vnFormatter.format(num);

  const getAreaBlocks = () => {
    const blocks = Array.from(areasContainer.children).filter(
      (el) => el.classList.contains("flex") && el.querySelector("span")?.textContent.includes("DIỆN TÍCH"),
    );
    return blocks;
  };

  const getAreaTitle = (block) => Array.from(block.querySelectorAll("span")).find((span) => /DIỆN\s*TÍCH/i.test(span.textContent || ""));

  const updateCoeffLabels = () => {
    if (!tileTypeSelect) return;
    const selectedTile = tileTypeSelect.options[tileTypeSelect.selectedIndex];
    if (!selectedTile || selectedTile.value === "") {
      if (resultTilesAm) resultTilesAm.querySelectorAll("span")[2].textContent = `-- viên/m²`;
      if (resultTilesDuong) resultTilesDuong.querySelectorAll("span")[2].textContent = `-- viên/m²`;
      if (resultDiem) resultDiem.querySelectorAll("span")[2].textContent = `-- cặp/md`;
      return;
    }

    const amCoeff = parseFloat(selectedTile.dataset.am) || 40;
    const duongCoeff = parseFloat(selectedTile.dataset.duong) || 27;
    const diemCoeff = parseFloat(selectedTile.dataset.diem) || 5;

    if (resultTilesAm) {
      const coeffSpan = resultTilesAm.querySelectorAll("span")[2];
      if (coeffSpan) coeffSpan.textContent = `${amCoeff} viên/m²`;
    }
    if (resultTilesDuong) {
      const coeffSpan = resultTilesDuong.querySelectorAll("span")[2];
      if (coeffSpan) coeffSpan.textContent = `${duongCoeff} viên/m²`;
    }
    if (resultDiem) {
      const coeffSpan = resultDiem.querySelectorAll("span")[2];
      if (coeffSpan) coeffSpan.textContent = `${diemCoeff} cặp/md`;
    }
  };

  const updateResults = () => {
    let totalS = 0;
    let totalL = 0;

    const blocks = getAreaBlocks();
    blocks.forEach((block) => {
      const select = block.querySelector("select");
      const inputs = Array.from(block.querySelectorAll("input")).filter(
        (i) => i.closest(".relative")?.parentElement.style.display !== "none",
      );
      const type = select.value || select.options[select.selectedIndex].text;

      let S = 0;
      let L = 0;

      if (type.includes("CHỮ NHẬT")) {
        const dai = parseFloat(inputs[0]?.value) || 0;
        const rong = parseFloat(inputs[1]?.value) || 0;
        S = dai * rong;
        L = dai;
      } else if (type.includes("THANG")) {
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
      const checkedRadio = Array.from(lossRadios).find((r) => r.checked);
      if (checkedRadio) {
        const label = checkedRadio.closest("label")?.textContent || "";
        if (label.includes("15%")) factor = 1.15;
        else if (label.includes("20%")) factor = 1.2;
      }
    }

    // If not selected, show zeros or placeholders but don't error out
    const styleFactor =
      roofStyleSelect && roofStyleSelect.value !== ""
        ? parseFloat(roofStyleSelect.options[roofStyleSelect.selectedIndex].dataset.factor) || 1.0
        : 0;

    factor *= styleFactor;

    // Update Labels
    updateCoeffLabels();

    // Get Tile Coefficients for math
    const selectedTile = tileTypeSelect?.options[tileTypeSelect.selectedIndex];
    const amCoeff = selectedTile && selectedTile.value !== "" ? parseFloat(selectedTile.dataset.am) || 0 : 0;
    const duongCoeff = selectedTile && selectedTile.value !== "" ? parseFloat(selectedTile.dataset.duong) || 0 : 0;
    const diemCoeff = selectedTile && selectedTile.value !== "" ? parseFloat(selectedTile.dataset.diem) || 0 : 0;

    const ngoiAm = Math.ceil(totalS * amCoeff * factor);
    const ngoiDuong = Math.ceil(totalS * duongCoeff * factor);
    const diem = Math.ceil(totalL * diemCoeff * factor);

    if (resultTilesAm) {
      resultTilesAm.querySelectorAll("span")[1].textContent = `${format(totalS)} m²`;
      resultTilesAm.querySelectorAll("span")[3].textContent = `${format(ngoiAm)} viên`;
    }
    if (resultTilesDuong) {
      resultTilesDuong.querySelectorAll("span")[1].textContent = `${format(totalS)} m²`;
      resultTilesDuong.querySelectorAll("span")[3].textContent = `${format(ngoiDuong)} viên`;
    }
    if (resultDiem) {
      resultDiem.querySelectorAll("span")[1].textContent = `${format(totalL)} md`;
      resultDiem.querySelectorAll("span")[3].textContent = `${format(diem)} cặp`;
    }
  };

  const handleTypeChange = (block) => {
    const select = block.querySelector("select");
    const type = select.value || select.options[select.selectedIndex].text;
    const inputGrid = block.querySelector(".grid-cols-12");
    const inputWrappers = Array.from(inputGrid.children);

    if (type.includes("CHỮ NHẬT")) {
      // Label 1
      const label1 = inputWrappers[1]?.querySelector("label");
      if (label1)
        label1.innerHTML = `CHIỀU DÀI <span class="block text-[12px] font-normal italic normal-case text-secondary/70">Chiều tính diềm mái</span>`;
      inputWrappers[1]?.classList.replace("md:col-span-3", "md:col-span-3"); // Stay same or adjust
      inputWrappers[1]?.classList.replace("col-span-4", "col-span-6");

      // Label 2
      const label2 = inputWrappers[2]?.querySelector("label");
      if (label2) label2.innerHTML = `CHIỀU RỘNG <span class="block text-[12px] opacity-0">&nbsp;</span>`;
      inputWrappers[2]?.classList.replace("md:col-span-3", "md:col-span-3");
      inputWrappers[2]?.classList.replace("col-span-4", "col-span-6");

      // Hide 3rd
      if (inputWrappers[3]) inputWrappers[3].style.display = "none";
    } else if (type.includes("THANG")) {
      // Label 1
      const label1 = inputWrappers[1]?.querySelector("label");
      if (label1)
        label1.innerHTML = `ĐÁY LỚN <span class="block text-[12px] font-normal italic normal-case text-secondary/70">Chiều tính diềm mái</span>`;
      inputWrappers[1]?.classList.replace("col-span-6", "col-span-4");

      // Label 2
      const label2 = inputWrappers[2]?.querySelector("label");
      if (label2) label2.innerHTML = `ĐÁY BÉ <span class="block text-[12px] opacity-0">&nbsp;</span>`;
      inputWrappers[2]?.classList.replace("col-span-6", "col-span-4");

      // Show 3rd
      if (inputWrappers[3]) {
        inputWrappers[3].style.removeProperty("display");
        inputWrappers[3]?.classList.replace("col-span-6", "col-span-4");
        const label3 = inputWrappers[3].querySelector("label");
        if (label3) label3.innerHTML = `CHIỀU CAO <span class="block text-[12px] opacity-0">&nbsp;</span>`;
      }
    }

    [inputWrappers[1], inputWrappers[2], inputWrappers[3]].forEach((wrapper) => {
      const label = wrapper?.querySelector("label");
      if (!label) return;
      label.classList.remove("min-h-[42px]");
      label.classList.add("h-[44px]", "flex", "flex-col", "items-center", "justify-start");
    });
    // updateResults(); // Removed from here: don't auto-calculate on shape change
  };

  const renumberAreas = () => {
    getAreaBlocks().forEach((block, index) => {
      const titleSpan = getAreaTitle(block);
      if (titleSpan) titleSpan.textContent = `DIỆN TÍCH ${index + 1}`;
    });
  };

  const setupListeners = (block) => {
    block.querySelectorAll("input").forEach((input) => {
      // input.addEventListener('input', updateResults); // Removed: only on button click
    });
    const select = block.querySelector("select");
    if (select) {
      select.addEventListener("change", () => handleTypeChange(block));
      // Trigger initial UI state
      handleTypeChange(block);
    }

    const removeBtn = block.querySelector("button.underline");
    if (removeBtn && removeBtn.textContent.includes("Loại bỏ")) {
      removeBtn.addEventListener("click", (e) => {
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
    newBlock.querySelectorAll("input").forEach((input) => (input.value = ""));

    // Ensure newly added block can be removed even if source template doesn't have the button.
    let removeBtn = newBlock.querySelector("button.underline");
    if (!removeBtn || !removeBtn.textContent.includes("Loại bỏ")) {
      const titleSpan = newBlock.querySelector("span.tracking-widest");
      const titleWrapper = titleSpan?.parentElement;
      if (titleWrapper) {
        titleWrapper.classList.add("flex", "flex-col");
        removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "text-[14px] text-secondary underline text-left font-bold";
        removeBtn.textContent = "Loại bỏ";
        titleWrapper.appendChild(removeBtn);
      }
    }

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
    addAreaBtn.addEventListener("click", (e) => {
      e.preventDefault();
      addArea();
    });
  }

  if (calculateBtn) {
    calculateBtn.addEventListener("click", (e) => {
      e.preventDefault();
      updateResults();
    });
  }

  if (extraLossCheckbox) {
    extraLossCheckbox.addEventListener("change", updateResults);
  }

  lossRadios.forEach((radio) => {
    radio.addEventListener("change", updateResults);
  });

  const checkButtonState = () => {
    if (!calculateBtn) return;
    const isStyleSelected = roofStyleSelect && roofStyleSelect.value !== "";
    const isTileSelected = tileTypeSelect && tileTypeSelect.value !== "";

    if (isStyleSelected && isTileSelected) {
      calculateBtn.disabled = false;
      calculateBtn.classList.remove("opacity-50", "cursor-not-allowed");
    } else {
      calculateBtn.disabled = true;
      calculateBtn.classList.add("opacity-50", "cursor-not-allowed");
    }
  };

  if (roofStyleSelect) {
    roofStyleSelect.addEventListener("change", () => {
      checkButtonState();
      // updateResults(); // Only for wastage
    });
  }

  if (tileTypeSelect) {
    tileTypeSelect.addEventListener("change", () => {
      updateCoeffLabels();
      checkButtonState();
    });
  }

  checkButtonState();
  updateResults();
};

export const initQuantityCalculator = () => {
  const calculatorSection = document.querySelector("[data-quantity-calculator]");
  if (!calculatorSection) return;

  const areaBlocks = () => Array.from(calculatorSection.querySelectorAll("[data-area-block]"));
  const initialBlocks = areaBlocks();
  const masterTemplate = (
    initialBlocks.find((block) => block.querySelector("[data-remove-area]")) || initialBlocks[initialBlocks.length - 1]
  )?.cloneNode(true);
  const addAreaBtn = calculatorSection.querySelector("[data-add-area]");
  const calculateBtn = calculatorSection.querySelector("[data-calculate-quantity]");
  const totalAreaOutput = calculatorSection.querySelector("[data-total-area-output]");
  const rateOutputs = Array.from(calculatorSection.querySelectorAll("[data-rate-output]"));
  const valueOutputs = Array.from(calculatorSection.querySelectorAll("[data-value-output]"));

  const extraLossCheckbox = calculatorSection.querySelector("#extra-loss-quantity");
  const lossRadios = Array.from(calculatorSection.querySelectorAll('input[name="loss-rate"]'));

  const numberFormatter = new Intl.NumberFormat("vi-VN");
  const formatNumber = (value) => numberFormatter.format(value);

  const parseNumericValue = (raw = "") => {
    const normalized = raw
      .replace(/\s/g, "")
      .replace(/,/g, ".")
      .replace(/[^\d.]/g, "");
    return parseFloat(normalized) || 0;
  };

  const getLossFactor = () => {
    if (!extraLossCheckbox || !extraLossCheckbox.checked) return 1;

    const selectedRadio = lossRadios.find((radio) => radio.checked);
    if (!selectedRadio) return 1;

    const labelText = selectedRadio.closest("label")?.textContent || "";
    if (labelText.includes("10%")) return 1.1;
    if (labelText.includes("5%")) return 1.05;
    return 1;
  };

  const getBlockArea = (block) => {
    const inputs = Array.from(block.querySelectorAll('input[type="text"]'));
    const length = parseNumericValue(inputs[0]?.value || "0");
    const width = parseNumericValue(inputs[1]?.value || "0");
    return length * width;
  };

  const getAreaTitle = (block) => Array.from(block.querySelectorAll("span")).find((span) => /DIỆN\s*TÍCH/i.test(span.textContent || ""));

  const renumberAreas = () => {
    areaBlocks().forEach((block, index) => {
      const title = getAreaTitle(block);
      if (title) title.textContent = `DIỆN TÍCH ${index + 1}`;
    });
  };

  const updateResults = () => {
    const rawArea = areaBlocks().reduce((sum, block) => sum + getBlockArea(block), 0);
    const roundedArea = Math.ceil(rawArea);
    const lossFactor = getLossFactor();

    if (totalAreaOutput) {
      totalAreaOutput.textContent = `${formatNumber(roundedArea)} m²`;
    }

    rateOutputs.forEach((rateEl, index) => {
      const rate = parseNumericValue(rateEl.textContent || "0");
      const quantity = Math.ceil(roundedArea * rate * lossFactor);

      if (valueOutputs[index]) {
        if (rate > 0) {
          valueOutputs[index].textContent = `${formatNumber(quantity)} viên`;
        } else {
          valueOutputs[index].textContent = "00 viên";
        }
      }
    });
  };

  const attachRemoveAreaListener = (block) => {
    const removeBtn = block.querySelector("[data-remove-area]");
    if (!removeBtn) return;

    removeBtn.addEventListener("click", (event) => {
      event.preventDefault();
      block.remove();
      renumberAreas();
      updateResults();
    });
  };

  const addArea = () => {
    if (!masterTemplate) return;

    const newBlock = masterTemplate.cloneNode(true);
    newBlock.querySelectorAll('input[type="text"]').forEach((input) => {
      input.value = "";
    });

    const removeBtn = newBlock.querySelector("[data-remove-area]");
    if (!removeBtn) {
      const title = getAreaTitle(newBlock);
      const header = title ? title.parentElement : null;
      if (header) {
        header.classList.add("flex", "flex-col");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("data-remove-area", "");
        btn.className = "text-[14px] text-secondary underline text-start ml-4 font-medium opacity-80 hover:opacity-100 transition-opacity";
        btn.textContent = "Loại bỏ";
        header.appendChild(btn);
      }
    }

    const addAreaRow = addAreaBtn?.parentElement;
    if (!addAreaRow) return;
    addAreaRow.before(newBlock);

    attachRemoveAreaListener(newBlock);
    renumberAreas();
  };

  areaBlocks().forEach(attachRemoveAreaListener);

  if (addAreaBtn) {
    addAreaBtn.addEventListener("click", (event) => {
      event.preventDefault();
      addArea();
    });
  }

  if (calculateBtn) {
    calculateBtn.addEventListener("click", (event) => {
      event.preventDefault();
      updateResults();
    });
  }

  if (extraLossCheckbox) {
    extraLossCheckbox.addEventListener("change", updateResults);
  }

  lossRadios.forEach((radio) => {
    radio.addEventListener("change", updateResults);
  });

  renumberAreas();
};
