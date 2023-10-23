// Code template
function buildHTMLTable(
    data,
    columnTitles = new Array(),
    columnPropertyNames = new Array(),
    idTable,
    specialColumns = new Array()
) {
    // Checks
    if (
        data.length === 0 ||
        columnTitles.length === 0 ||
        columnPropertyNames.length === 0
    ) {
        throw new Error(
            "Please check the table building function. There are some empty array parameters."
        );
    }
    for (let i = 0; i < columnPropertyNames.length; i++) {
        let functionsAmount = 0;
        if (
            columnPropertyNames[i].substring(0, 23) === "specialFunctionPosition"
        ) {
            functionsAmount++;
            if (
                isNaN(parseInt(columnPropertyNames[i].substring(23, 26))) ||
                specialColumns.length < functionsAmount ||
                !specialColumns[parseInt(columnPropertyNames[i].substring(23, 26))]
            ) {
                throw new Error(
                    "The special columns that you indicated could not be loaded. Please check your input parameters."
                );
            }
        }
    }

    const table = document.createElement("table");
    table.id = idTable;
    const tableHeader = document.createElement("thead");
    const tableBody = document.createElement("tbody");
    const headRow = document.createElement("tr");
    for (let i = 0; i < columnTitles.length; i++) {
        let text = "";
        const headCell = document.createElement("th");
        headCell.innerText = columnTitles[i];
        headRow.appendChild(headCell);
    }
    tableHeader.appendChild(headRow);

    for (let i = 0; i < data.length; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < columnPropertyNames.length; j++) {
            const cell = document.createElement("td");
            if (
                columnPropertyNames[j].substring(0, 23) ===
                "specialFunctionPosition"
            ) {
                const indexSpecial = parseInt(
                    columnPropertyNames[j].substring(23, 26)
                );
                const params = [];
                for (
                    let p = 0;
                    p < specialColumns[indexSpecial].params.length;
                    p++
                ) {
                    params.push(data[i][specialColumns[indexSpecial].params[p]]);
                }
                cell.innerText =
                    typeof specialColumns[indexSpecial].method === "string"
                        ? formatFunctions[specialColumns[indexSpecial].method](
                            ...params
                        )
                        : specialColumns[indexSpecial].method(...params);
            } else {
                cell.innerText = data[i][columnPropertyNames[j]];
            }
            row.appendChild(cell);
        }
        tableBody.appendChild(row);
    }

    table.appendChild(tableHeader);
    table.appendChild(tableBody);
    return table;
}

// Calling
app.appendChild(
    buildHTMLTable(
        data,
        ["Column1Name", "Column2Name", "Column3Name"],
        ["specialFunctionPosition0", "specialFunctionPosition1", "columnName3"],
        "tableId",
        [
            {
                params: ["date"], // Is the name of the data property 
                method: "epochToDate", // Is the method to format the data
            },
            {
                params: ["price"],
                method: "currency",
            },
        ]
    )
);