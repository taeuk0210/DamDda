package org.eightbit.damdda.common.utils.file;

import lombok.extern.log4j.Log4j2;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Component
@Log4j2
public class ExcelGenerator {

    /**
     * Generates an Excel file dynamically based on provided data and sheet name.
     *
     * @param sheetName The name of the Excel sheet to be created.
     * @param data      A list of maps, where each map represents a row with column names as keys.
     * @return A temporary file containing the generated Excel sheet.
     * @throws IOException If an I/O error occurs during file creation or writing.
     */
    public File generateExcelFile(String sheetName, List<Map<String, Object>> data) throws IOException {
        // Validate input data
        if (data == null || data.isEmpty()) {
            log.error("[Excel Generator] Data is null or empty, cannot generate Excel file.");
            throw new IllegalArgumentException("Data cannot be null or empty.");
        }

        // Use try-with-resources to ensure the Workbook is closed properly
        try (Workbook workbook = new XSSFWorkbook()) {
            // Create a new sheet in the workbook
            Sheet sheet = workbook.createSheet(sheetName);
            log.info("[Excel Generator] Created Excel sheet '{}'.", sheetName);

            // Extract headers from the first row of the data
            List<String> headers = new ArrayList<>(data.get(0).keySet());

            // Create the header row
            createHeaderRow(sheet, headers);

            // Create a reusable date cell style
            CellStyle dateCellStyle = createDateCellStyle(workbook);

            // Fill the sheet with data rows
            fillDataRows(sheet, headers, data, dateCellStyle);

            // Write the workbook content to a temporary file
            return writeToFile(workbook);
        } catch (IOException e) {
            log.error("[Excel Generator] Failed to generate Excel file.", e);
            throw e;
        }
    }


    /**
     * Creates the header row based on the provided headers list.
     *
     * @param sheet   The sheet where the header row will be created.
     * @param headers A list of column names to use as headers.
     */
    private void createHeaderRow(Sheet sheet, List<String> headers) {
        // Create the first row for headers
        Row headerRow = sheet.createRow(0);
        for (int i = 0; i < headers.size(); i++) {
            headerRow.createCell(i).setCellValue(headers.get(i));
        }
    }

    /**
     * Fills the Excel sheet with data rows.
     *
     * @param sheet         The Excel sheet where data will be added.
     * @param headers       The list of headers (column names) to match data keys.
     * @param data          A list of maps where each map contains data for one row.
     * @param dateCellStyle The cell style for date values.
     */
    private void fillDataRows(Sheet sheet, List<String> headers, List<Map<String, Object>> data, CellStyle dateCellStyle) {
        int rowNum = 1; // Start after the header row
        for (Map<String, Object> rowData : data) {
            Row row = sheet.createRow(rowNum++);
            int colNum = 0;
            for (String header : headers) {
                Cell cell = row.createCell(colNum++);
                setCellValue(cell, rowData.get(header), dateCellStyle);
            }
        }
    }

    /**
     * Sets the value of a cell based on the type of the provided value.
     *
     * @param cell          The Excel cell to set the value for.
     * @param value         The value to set in the cell.
     * @param dateCellStyle The cell style for date-type values.
     */
    private void setCellValue(Cell cell, Object value, CellStyle dateCellStyle) {
        // Dynamically determine the value's type and set it to the cell
        if (value instanceof String) {
            cell.setCellValue((String) value);
        } else if (value instanceof Integer) {
            cell.setCellValue((Integer) value);
        } else if (value instanceof Double) {
            cell.setCellValue((Double) value);
        } else if (value instanceof Boolean) {
            cell.setCellValue((Boolean) value);
        } else if (value instanceof LocalDateTime) {
            cell.setCellValue(((LocalDateTime) value).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        } else if (value instanceof Date) {
            cell.setCellValue((Date) value);
            cell.setCellStyle(dateCellStyle);
        } else if (value instanceof BigDecimal) {
            cell.setCellValue(((BigDecimal) value).doubleValue());
        } else if (value != null) {
            cell.setCellValue(value.toString());
        }
    }

    /**
     * Creates and returns a date cell style to be used for formatting date cells.
     *
     * @param workbook The workbook to which the style belongs.
     * @return A cell style for formatting date cells.
     */
    private CellStyle createDateCellStyle(Workbook workbook) {
        // Create and configure a date cell style
        CellStyle cellStyle = workbook.createCellStyle();
        CreationHelper createHelper = workbook.getCreationHelper();
        cellStyle.setDataFormat(createHelper.createDataFormat().getFormat("yyyy-MM-dd"));
        return cellStyle;
    }

    /**
     * Writes the Excel workbook content to a temporary file and returns the file.
     *
     * @param workbook The workbook to be written to a file.
     * @return A File object pointing to the temporary file created.
     * @throws IOException If an error occurs during writing.
     */
    private File writeToFile(Workbook workbook) throws IOException {
        File tempFile = File.createTempFile("generated_excel_", ".xlsx");

        try (workbook; FileOutputStream fileOut = new FileOutputStream(tempFile)) {
            workbook.write(fileOut);
        }

        return tempFile;
    }
}
