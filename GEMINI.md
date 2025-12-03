MobileSpa Frontend Feature Implementation Guide

This document outlines the final features required for the MobileSpa application. The primary focus of these features is robust client-side state management, precise date/time constraints, and seamless integration with the WhatsApp API for booking and voucher transactions.

🔴 MANDATORY PREREQUISITE

Before starting any implementation, the developer MUST thoroughly read all existing files and folders under the parent directory mobilespa/. A clear understanding of the existing React component structure, state management patterns (Context, Redux, or simple useState), and the location of service/booking data is fundamental to successfully implementing these changes.

1. Robust WhatsApp Integration & Booking Logic

The core booking mechanism relies on constructing a structured message payload and sending it via the official WhatsApp API link.

1.1. WhatsApp Booking URL Construction

The booking function must assemble the following URL pattern:
https://wa.me/<whatsapp_number>?text=<encoded_message>

WhatsApp Number: Ensure the target mobile number is correctly configured and accessible globally (e.g., in an environment variable or configuration file).

Message Encoding: The compiled message string MUST be URL-encoded using encodeURIComponent() to ensure all spaces, newlines, and special characters are transmitted correctly.

1.2. Booking Message Payload Structure

The final string that is encoded and sent to WhatsApp must clearly present all gathered booking details, including:

Field

Required Data

Example Format in Message

Customer Info

Name, Phone, Email

`Client: Jane Doe (jane@email.com)

Selected Services

List of services, price, duration

`Services: 1x Deep Tissue (60m)

Total Summary

Total duration, total cost

`Total Duration: 90 minutes

Booking Time

Selected date and 15-minute slot

Date/Time: 2024-12-25 @ 14:15

Location

Text link to the shared coordinates

Location: https://maps.google.com/?q=... (See Section 2)

2. Share Location Functionality

The share location feature must utilize the browser's Geolocation API and format the coordinates into a universally recognizable Google Maps URL.

API Check: Before attempting to retrieve location, check if navigator.geolocation is available. If not, prompt the user with a gentle fallback message (e.g., "Please manually enter your address.").

Permission Request: Call navigator.geolocation.getCurrentPosition(success, error) to request the user's current coordinates.

Coordinate Formatting: Upon success, extract the latitude and longitude. The final message payload (Section 1.2) must include a direct link using the following structure:

Location Link: [https://maps.google.com/?q=](https://maps.google.com/?q=)<latitude>,<longitude>


3. Booking Modification and Discard Logic

This requires updates to the component responsible for displaying the selected services (the "cart" or service list) and the main booking modal.

3.1. Discard Individual Service (The "(-)" Button)

Location: Add a visually clear (-) button next to each selected service item displayed in the "how to book" section.

State Logic: This button must trigger a function that receives the unique ID or index of the service to be removed.

It must filter the main services array in the booking state, removing the corresponding item.

It must recalculate the total booking duration and total cost immediately after removal.

Visual Feedback: Ensure the UI updates in real-time as the service is discarded.

3.2. Discard Entire Booking (The "(X)" Button)

Location: Place a prominent, accessible (X) icon or button within the header or top corner of the booking modal.

State Logic: This button must trigger a function that completely resets the entire booking state object/context.

This includes clearing the selected services array, total cost, total duration, selected date, selected time, and any customer input fields.

Modal Closure: After resetting the state, the modal should close automatically, returning the user to the main page or service selection screen.

4. Time and Date Constraints

4.1. Time Selection (Multiples of 15 Minutes)

Constraint: The time selection mechanism (likely a dropdown or number input) for the minutes field must only allow selection in increments of 15.

Implementation: If using a standard HTML <select> for minutes, the options should be hardcoded as: 00, 15, 30, 45.

Validation: If using a free-form input, implement client-side validation on change to ensure the entered minute value is divisible by 15. If it's not, provide an error message and revert the input to the nearest valid 15-minute increment.

4.2. Calendar Selection (One Month Ahead)

Constraint: The date picker component (e.g., an external React date picker library or custom component) must prevent the user from selecting dates outside a 30-day window from the current date.

Implementation:

Calculate the maximum allowable date: maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).

Pass this maxDate as a max or disableDate prop to the calendar component.

Ensure all previous dates are also disabled (minDate = new Date()).

5. Voucher System Integration

The purchase and redemption of vouchers require a distinct and equally detailed WhatsApp message workflow.

5.1. Voucher Message Payload

The function responsible for submitting the voucher form (both purchase and redemption) must compile a separate message payload. This message must capture all input fields specific to the voucher transaction:

Field

Required Data

Notes

Transaction Type

"Voucher Purchase" or "Voucher Redemption"

Explicitly state the type.

Customer Details

Name, Phone, Email

All details must be included.

Voucher Specifics

Voucher Code (if redeeming), Value/Service (if purchasing), Recipient Name (if purchasing as gift).

Include all relevant fields from the form.

5.2. WhatsApp Submission

Similar to the main booking, the completed voucher message string must be URL-encoded and submitted via the https://wa.me/ link.

6. General Input Data Integrity Check

The developer must perform a final QA pass across all input forms (Booking, Location, Vouchers) to ensure:

Non-Empty Checks: Essential fields (Name, Phone, Date, Time, Services) are validated and required.

Data Persistence in State: All data points are correctly saved into the central application state before the WhatsApp message generation function is called.

Correct Concatenation: All state variables are correctly concatenated into the final message string, confirming the correct variable names are used and no data is accidentally missed from the payload.

By following these instructions, the developer should be able to deliver a polished and fully functional booking and voucher system that reliably communicates with the MobileSpa team via WhatsApp.