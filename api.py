from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from main import process_case

app = FastAPI()

@app.post("/case")
async def receive_case(request: Request):
    data = await request.json()
    if not data or "CNR Number" not in data:
        return JSONResponse({"error": "Input must contain 'CNR Number' key"}, status_code=400)
    case_number = data["CNR Number"]
    success, message = process_case(case_number)
    if success:
        return {"message": message}
    else:
        return JSONResponse({"error": message}, status_code=500)




@app.post("/cases")
async def receive_cases(request: Request):
    data = await request.json()
    if not isinstance(data, list):
        return JSONResponse({"error": "Input must be a list of objects with 'CNR Number'"}, status_code=400)
    results = []
    for idx, item in enumerate(data, 1):
        cnr = item.get("CNR Number", None)
        print(f"\n--- [{idx}/{len(data)}] Processing CNR: {cnr} ---")
        if not isinstance(item, dict) or "CNR Number" not in item:
            print(f"❌ Skipping: Missing 'CNR Number' key in item: {item}")
            results.append({"CNR Number": cnr, "success": False, "message": "Missing 'CNR Number' key"})
            continue
        print(f"➡️ Starting processing for CNR: {cnr}")
        success, message = process_case(cnr)
        if success:
            print(f"✅ Finished processing CNR: {cnr} - Success")
        else:
            print(f"❌ Error processing CNR: {cnr} - {message}")
        results.append({"CNR Number": cnr, "success": success, "message": message})
    print("\nAll CNRs processed.")
    return {"results": results}