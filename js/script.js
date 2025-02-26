function createElement(tagName, attributes, textContent = "") {
  const element = document.createElement(tagName);
  element.textContent = textContent;
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
  return element;
}
const API_URL = "https://67ada5373f5a4e1477de7240.mockapi.io/inc-exp";

async function fetchAndDisplay(element, filter = ["all", "income", "expense"]) {
  try {
    const response = await fetch(API_URL);
    const data = (await response.json()) || [];

    element.innerHTML = "";
    let totalIncome = 0;
    let totalExpense = 0;

    const filteredData = filter.includes("all")
      ? data
      : data.filter((entry) => filter.includes(entry.type.toLowerCase()));

    filteredData.forEach((entry) => {
      const tableRow = element.appendChild(
        createElement("tr", {
          class: "border-b-2 border-gray-200 hover:bg-gray-100",
        })
      );

      tableRow.appendChild(
        createElement("td", { class: "p-4" }, entry.id)
      );
      tableRow.appendChild(
        createElement("td", { class: "p-4" }, entry.description)
      );
      tableRow.appendChild(
        createElement(
          "td",
          {
            class: "p-4",
          },
          entry.type
        )
      );

      tableRow.appendChild(
        createElement("td", { class: "p-4" }, `${entry.amount}`)
      );
      tableRow.className =
        entry.type === "Income"
          ? "tableRow-color table-border-1 hover:cursor-pointer"
          : entry.type === "expense"
          ? ""
          : "tableRow-1-color table-border-2 hover:cursor-pointer";
      const actionArea = tableRow.appendChild(
        createElement("td", {
          class: "",
        })
      );

      const editButton = actionArea.appendChild(
        createElement(
          "button",
          {
            class:
              "p-4 text-blue-500 font-semibold hover:text-blue-900 focus:outline-none hover:cursor-pointer hover:underline",
          },
          "Edit"
        )
      );

      editButton.addEventListener("click", async () => {
        try {
          const response = await fetch(API_URL + "/" + entry.id, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...entry,
              description: prompt("Enter new description"),
            }),
          });
          if (response.ok) {
            fetchAndDisplay(element, filter);
          } else {
            alert("Error updating entry: " + (await response.text()));
          }
        } catch (error) {
          alert("Error updating entry: " + error);
        }
      });

      const deleteButton = actionArea.appendChild(
        createElement(
          "button",
          {
            class:
              "p-4 text-red-500 font-semibold hover:text-red-900 focus:outline-none hover:cursor-pointer hover:underline",
          },
          "Delete"
        )
      );

      deleteButton.addEventListener("click", async () => {
        try {
          const response = await fetch(API_URL + "/" + entry.id, {
            method: "DELETE",
          });
          tableRow.remove();
          fetchAndDisplay(element, filter);
        } catch (error) {
          alert("Error deleting entry: " + error);
        }
      });
      if (entry.type === "Income") {
        totalIncome += parseFloat(entry.amount);
      } else if (entry.type === "Expense") {
        totalExpense += parseFloat(entry.amount);
      }
    });

    document.querySelector("#balance").textContent = `$${
      totalIncome - totalExpense
    }`;
    document.querySelector("#income").textContent = `$${totalIncome}`;
    document.querySelector("#expense").textContent = `$${totalExpense}`;
  } catch (error) {
    alert("Error fetching data: " + error);
  }
}

window.onload = () => {
  const nav = document.body.appendChild(
    createElement("nav", {
      class: "flex justify-center items-center sm:h-20 md:h-24 lg:h-40 ",
    })
  );
  nav.appendChild(
    createElement(
      "h1",
      {
        class: "text-center font-bold text-4xl font-serif mt-6",
      },
      "Income Expenses Calculator"
    )
  );
  const cardDiv = document.body.appendChild(
    createElement("div", {
      class:
        "container mx-auto lg:flex lg:flex-row lg:justify-around lg:items-center lg:gap-6 lg:my-12 md:flex md:flex-col md:my-4 sm:flex sm:flex-col sm:my-2",
    })
  );
  const card1 = cardDiv.appendChild(
    createElement("div", {
      class: "card px-24 py-8 bg-white shadow-xl rounded-lg sm:my-6 md:my-4",
    })
  );
  card1.appendChild(
    createElement(
      "h2",
      {
        class: "text-left font-bold text-2xl font-serif",
      },
      "Your Balance"
    )
  );
  card1.appendChild(
    createElement(
      "p",
      {
        id: "balance",
        class: "text-left font-bold text-4xl font-serif text-blue-500",
      },
      "$ 0.00"
    )
  );
  const card2 = cardDiv.appendChild(
    createElement("div", {
      class: "card px-24 py-8 bg-white shadow-xl rounded-lg sm:my-6 md:my-4",
    })
  );
  card2.appendChild(
    createElement(
      "h2",
      {
        class: "text-left font-bold text-2xl font-serif",
      },
      "Income"
    )
  );
  card2.appendChild(
    createElement(
      "p",
      {
        id: "income",
        class: "text-left font-bold text-4xl font-serif text-green-500",
      },
      "$ 0.00"
    )
  );
  const card3 = cardDiv.appendChild(
    createElement("div", {
      class: "card px-24 py-8 bg-white shadow-xl rounded-lg sm:my-6 md:my-4",
    })
  );
  card3.appendChild(
    createElement(
      "h2",
      {
        class: "text-left font-bold text-2xl font-serif",
      },
      "Expenses"
    )
  );
  card3.appendChild(
    createElement(
      "p",
      {
        id: "expense",
        class: "text-left font-bold text-4xl font-serif text-red-500",
      },
      "$ 0.00"
    )
  );
  const entryDiv = document.body.appendChild(
    createElement("div", {
      class: "container mx-auto p-10",
    })
  );
  const entryCard = entryDiv.appendChild(
    createElement("div", {
      class:
        "flex flex-col justify-center my-4 gap-6 px-12 py-8 shadow-lg bg-white rounded-lg",
    })
  );
  entryCard.appendChild(
    createElement(
      "h2",
      {
        class: "font-bold text-4xl font-serif",
      },
      "Add New Entry"
    )
  );
  const selectDiv = entryCard.appendChild(
    createElement("div", {
      class: "flex flex-col",
    })
  );
  const incomeSelect = selectDiv.appendChild(
    createElement("select", {
      id: "type",
      class: "px-6 py-2 border-2 border-gray-200 rounded-lg mt-2",
    })
  );
  incomeSelect.appendChild(createElement("option", {}, "Income"));
  incomeSelect.appendChild(createElement("option", {}, "Expense"));
  const descriptionDiv = entryCard.appendChild(
    createElement("div", {
      class: "flex flex-col mt-4",
    })
  );
  descriptionDiv.appendChild(
    createElement(
      "h3",
      {
        class: "text-lg font-semibold",
      },
      "Description"
    )
  );
  const descriptionSelect = descriptionDiv.appendChild(
    createElement("input", {
      type: "text",
      id: "description",
      class: "px-6 py-2 border-2 border-gray-200 rounded-lg mt-2",
    })
  );
  const amountDiv = entryCard.appendChild(
    createElement("div", {
      class: "flex flex-col mt-4",
    })
  );
  amountDiv.appendChild(
    createElement(
      "h3",
      {
        class: "text-lg font-semibold",
      },
      "Amount"
    )
  );
  const amountSelect = amountDiv.appendChild(
    createElement("input", {
      type: "number",
      id: "amount",
      class: "px-6 py-2 border-2 border-gray-200 rounded-lg mt-2",
    })
  );
  const buttonDiv = entryCard.appendChild(
    createElement("div", {
      class: "flex flex-col mt-4",
    })
  );

  buttonDiv.appendChild(
    createElement(
      "button",
      {
        class:
          "p-4 bg-blue-500 text-white rounded-lg mt-4 font-bold hover:bg-blue-700 hover:cursor-pointer",
      },
      "Add Entry"
    )
  );

  buttonDiv.addEventListener("click", async function addEntry() {
    // Select the table body first
    const tbody = document.querySelector("#tableData");

    if (
      incomeSelect.value === "" ||
      descriptionSelect.value === "" ||
      amountSelect.value === ""
    ) {
      alert("Please fill all fields");
      return;
    }

    // Update card amounts
    if (incomeSelect.value === "Income") {
      card2.querySelector("p").textContent = `$${
        parseFloat(card2.querySelector("p").textContent.slice(1)) +
        parseFloat(amountSelect.value)
      }`;
      card1.querySelector("p").textContent = `$${
        parseFloat(card1.querySelector("p").textContent.slice(1)) +
        parseFloat(amountSelect.value)
      }`;
    }
    if (incomeSelect.value === "Expense") {
      card3.querySelector("p").textContent = `$${
        parseFloat(card3.querySelector("p").textContent.slice(1)) +
        parseFloat(amountSelect.value)
      }`;
      card1.querySelector("p").textContent = `$${
        parseFloat(card1.querySelector("p").textContent.slice(1)) -
        parseFloat(amountSelect.value)
      }`;
    }

    const entry = {
      type: incomeSelect.value,
      description: descriptionSelect.value,
      amount: parseFloat(amountSelect.value),
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entry),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.warn(error);
    } finally {
      // Reset form fields
      incomeSelect.selectedIndex = 0;
      descriptionSelect.value = "";
      amountSelect.value = "";

      // Update the table with all entries
      if (tbody) fetchAndDisplay(tbody, ["all"]);
    }
  });

  const radioDiv = document.body.appendChild(
    createElement("div", {
      class: "flex justify-center items-center gap-3 my-4",
    })
  );
  radioDiv.appendChild(
    createElement("input", {
      type: "radio",
      name: "filter",
      value: "All",
    })
  );
  radioDiv.appendChild(createElement("label", {}, "All"));
  radioDiv.appendChild(
    createElement("input", {
      type: "radio",
      name: "filter",
      value: "Income",
    })
  );
  radioDiv.appendChild(createElement("label", {}, "Income"));
  radioDiv.appendChild(
    createElement("input", {
      type: "radio",
      name: "filter",
      value: "Expense",
    })
  );
  radioDiv.appendChild(createElement("label", {}, "Expense"));

  const radioButtons = document.querySelectorAll("input[name='filter']");
  radioButtons.forEach((radio) => {
    radio.addEventListener("change", (event) => {
      const selectedFilter = event.target.value.toLowerCase();
      fetchAndDisplay(
        document.querySelector("#tableData"),
        selectedFilter === "all" ? ["all"] : [selectedFilter]
      );
    });
  });

  const tableContainer = document.body.appendChild(
    createElement("div", {
      class: "container mx-auto p-10 ",
    })
  );
  tableContainer.appendChild(
    createElement(
      "h2",
      {
        class: "font-bold text-4xl font-serif p-10",
      },
      "Budget Table"
    )
  );
  const tableWrapper = tableContainer.appendChild(
    createElement("div", {
      class: "table-container",
    })
  );
  const table = tableWrapper.appendChild(
    createElement("table", {
      class: "text-left shadow-lg w-full bg-white",
    })
  );

  const thead = table.appendChild(
    createElement("thead", {
      class: "bg-gray-200 font-playfair font-bold text-xl",
    })
  );

  const theadRow = thead.appendChild(createElement("tr"));

  theadRow.appendChild(createElement("th", { class: "p-4" }, "Id"));

  theadRow.appendChild(createElement("th", { class: "p-4" }, "Description"));

  theadRow.appendChild(createElement("th", { class: "p-4" }, "Type"));

  theadRow.appendChild(createElement("th", { class: "p-4" }, "Amount"));

  theadRow.appendChild(createElement("th", { class: "p-4" }, "Actions"));

  const tbody = table.appendChild(createElement("tbody", { id: "tableData" }));
  fetchAndDisplay(tbody);
};
