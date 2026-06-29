from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import Select
import time
import os

def run_test():
    options = webdriver.ChromeOptions()
    # options.add_argument('--headless') 
    
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    try:
        # --- 2. Test Registration (Optional/Conditional) ---
        print("\n--- Testing Registration ---")
        try:
            driver.get("http://localhost:3000/register")
            print("Navigated to Registration Page")
            
            # --- Real-time Validation Test ---
            print("Testing Real-time Validation...")
            
            # Test 1: Short Name
            first_name_input = driver.find_element(By.NAME, "first_name")
            first_name_input.send_keys("a")
            time.sleep(0.5)
            if "Must be at least 2 characters" in driver.page_source:
                 print("PASS: Short name validation detected")
            else:
                 print("FAIL: Short name validation NOT detected")
                 
            # Test 2: Invalid Email
            email_input = driver.find_element(By.CSS_SELECTOR, "input[type='email']")
            email_input.send_keys("invalid-email")
            time.sleep(0.5)
            if "Invalid email format" in driver.page_source:
                 print("PASS: Invalid email validation detected")
            else:
                 print("FAIL: Invalid email validation NOT detected")
                 
            # Clear fields for actual registration
            first_name_input.clear()
            email_input.clear()
            print("Real-time Validation Test Completed")
            # ---------------------------------

            # Using timestamp to create unique user
            timestamp = int(time.time())
            test_email = f"test_user_{timestamp}@example.com"
            
            print(f"Registering user: {test_email}")
            
            # Fill Registration Form by Name attribute
            driver.find_element(By.NAME, "first_name").send_keys(f"Test{timestamp}")
            driver.find_element(By.NAME, "last_name").send_keys("User")
            driver.find_element(By.NAME, "email").send_keys(test_email)
            driver.find_element(By.NAME, "phone_number").send_keys("1234567890")
            driver.find_element(By.NAME, "age").send_keys("30")
            
            # Gender Select
            gender_select = Select(driver.find_element(By.NAME, "gender"))
            gender_select.select_by_value("M")
            
            # Passwords
            driver.find_element(By.NAME, "password").send_keys("password123")
            driver.find_element(By.NAME, "password_confirmation").send_keys("password123")
            
            # Checkbox
            checkbox = driver.find_element(By.CSS_SELECTOR, "input[type='checkbox']")
            if not checkbox.is_selected():
                try:
                    checkbox.click()
                except:
                    driver.execute_script("arguments[0].click();", checkbox)
            
            # Submit
            submit_btn = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            submit_btn.click()
            
            # Handle SweetAlert2 (Registration Successful)
            try:
                from selenium.webdriver.support.ui import WebDriverWait
                from selenium.webdriver.support import expected_conditions as EC
                
                # Wait for SweetAlert2 popup
                print("Waiting for SweetAlert2...")
                swal_confirm = WebDriverWait(driver, 5).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, "button.swal2-confirm"))
                )
                print("SweetAlert2 found! Clicking confirmation...")
                swal_confirm.click()
                time.sleep(1) # Wait for animation/redirect
                
            except Exception as e:
                print(f"SweetAlert2 interaction failed (might be native alert or no alert): {e}")

            time.sleep(2)
            
            # Check if redirected to login
            if "login" in driver.current_url:
                print("Registration Successful - Redirected to Login")
                login_email = test_email
            else:
                print(f"Registration might have failed. Current URL: {driver.current_url}")
                # Check for alerts
                try:
                    alert = driver.find_element(By.CLASS_NAME, "alert-danger")
                    print(f"Alert Text: {alert.text}")
                except:
                    pass
                login_email = test_email # Try anyway? Or fallback?

        except Exception as e:
            print(f"Registration Test Failed/Skipped: {e}")
            login_email = "test_user_new@example.com"

        # --- 3. Test Login ---
        print("\n--- Testing Login ---")
        # Ensure we are on login page
        if "login" not in driver.current_url:
            driver.get("http://localhost:3000/login")
            time.sleep(2)

        try:
            print(f"Logging in with {login_email}...")
            
            # Login inputs have no name attribute, using type/placeholder
            email_input = driver.find_element(By.CSS_SELECTOR, "input[type='email']")
            email_input.clear()
            email_input.send_keys(login_email)
            
            password_input = driver.find_element(By.CSS_SELECTOR, "input[type='password']")
            password_input.clear()
            password_input.send_keys("password123")
            
            submit_btn = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            submit_btn.click()
            time.sleep(5)
            
            if "login" not in driver.current_url:
                print(f"Login Successful. Current URL: {driver.current_url}")
            else:
                print("Login Failed - remained on login page.")
                try:
                    alert = driver.find_element(By.CLASS_NAME, "alert-danger")
                    print(f"Login Error: {alert.text}")
                except:
                    pass
                # raise Exception("Login failed") 
                # Don't raise, continue to try navigation? No, upload needs auth.
                return

        except Exception as e:
            print(f"CRITICAL: Login Interaction Failed: {e}")
            return

        # --- 4. Test Navigation ---
        print("\n--- Testing Navigation ---")
        links = ["Home", "Upload", "My Reports"]
        for link_text in links:
            try:
                # Try precise link text first, then partial
                try:
                    link = driver.find_element(By.LINK_TEXT, link_text)
                except:
                    link = driver.find_element(By.PARTIAL_LINK_TEXT, link_text)
                
                link.click()
                print(f"Clicked '{link_text}'")
                time.sleep(2)
            except:
                print(f"Could not find link '{link_text}'")

        # --- 5. Test Image Upload ---
        print("\n--- Testing Image Upload ---")
        try:
            if "upload" not in driver.current_url:
                driver.get("http://localhost:3000/upload")
            time.sleep(2)
            
            file_input = driver.find_element(By.CSS_SELECTOR, "input[type='file']")
            
            # Using the image we located earlier
            image_path = os.path.abspath(r"c:/Users/lenovo/Desktop/pro/UnifiedProject/ml/data/resized_dataset/images/00000001_000.png")
            
            file_input.send_keys(image_path)
            print(f"Selected file: {image_path}")
            
            # Find Upload button (React-Bootstrap button usually logic)
            # Look for button in the form
            upload_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Upload') or contains(text(), 'Analyze')]")
            driver.execute_script("arguments[0].click();", upload_btn)
            print("Clicked Upload/Analyze (via JS)")
            
            # Wait for result
            time.sleep(10)
            
            body_text = driver.find_element(By.TAG_NAME, "body").text
            if "Prediction" in body_text or "Loading" not in body_text:
                print("Upload & Analysis completed.")
                # Verify result content?
            else:
                print("Analysis might still be processing or failed")
                
        except Exception as e:
            print(f"Upload Test Failed: {e}")

        # --- 6. Test Logout ---
        print("\n--- Testing Logout ---")
        try:
            logout_btn = driver.find_element(By.XPATH, "//button[contains(text(),'Logout')]")
            logout_btn.click()
            print("Clicked Logout")
            time.sleep(2)
        except:
             print("Logout button not found")

    except Exception as e:
        print(f"Test Failed: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    run_test()
