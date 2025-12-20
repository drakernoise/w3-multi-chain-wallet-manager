import openpyxl
import os

file_path = 'Depuración.xlsx'
if not os.path.exists(file_path):
    print(f"Error: {file_path} not found")
    exit(1)

try:
    wb = openpyxl.load_workbook(file_path, data_only=True)
    sheet = wb.active
    for row in sheet.iter_rows():
        print('\t'.join([str(cell.value) if cell.value is not None else "" for cell in row]))
except Exception as e:
    print(f"Error reading excel: {e}")
    exit(1)
