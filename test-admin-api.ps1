# PowerShell script to test Admin API endpoints
# Run this script in PowerShell to test the admin API endpoints

# Configuration
$apiUrl = "http://localhost:5000/api"
$adminEmail = "admin@gamil.com"
$adminPassword = "password123"
$token = ""
$userId = ""
$propertyId = ""
$bookingId = ""

# Helper functions for pretty printing
function Write-Header {
    param([string]$text)
    Write-Host "`n=== $text ===" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$text)
    Write-Host "✓ $text" -ForegroundColor Green
}

function Write-Error {
    param([string]$text)
    Write-Host "✗ $text" -ForegroundColor Red
}

# Step 1: Admin Login - Get Authentication Token
Write-Header "Admin Login"
$loginBody = @{
    email = $adminEmail
    password = $adminPassword
} | ConvertTo-Json

try {
    $tokenResponse = Invoke-RestMethod -Uri "$apiUrl/auth/login" -Method Post -ContentType "application/json" -Body $loginBody
    $token = $tokenResponse.token
    Write-Success "Login successful, received token"
} catch {
    Write-Error "Login failed: $_"
    exit
}

# Step 2: User Management Tests
Write-Header "USER MANAGEMENT"

# Get All Users
Write-Host "Getting all users..."
try {
    $headers = @{
        Authorization = "Bearer $token"
    }
    $usersResponse = Invoke-RestMethod -Uri "$apiUrl/users" -Method Get -Headers $headers
    
    if ($usersResponse) {
        Write-Success "Found $($usersResponse.Count) users"
        
        # Get first user ID for later tests
        if ($usersResponse.Count -gt 0) {
            $userId = $usersResponse[0]._id
            Write-Host "Using user ID: $userId for tests"
        }
    } else {
        Write-Error "No users found or response format unexpected"
    }
} catch {
    Write-Error "Failed to get users: $_"
}

# Get User By ID
if ($userId) {
    Write-Host "Getting user by ID: $userId..."
    try {
        $userDetail = Invoke-RestMethod -Uri "$apiUrl/users/$userId" -Method Get -Headers $headers
        Write-Success "Retrieved user: $($userDetail.name) ($($userDetail.email))"
    } catch {
        Write-Error "Failed to get user details: $_"
    }
    
    # Uncomment to test user deletion
    <#
    Write-Host "Deleting user: $userId..."
    try {
        $deleteResponse = Invoke-RestMethod -Uri "$apiUrl/users/$userId" -Method Delete -Headers $headers
        Write-Success "Delete user response: $($deleteResponse | ConvertTo-Json -Compress)"
    } catch {
        Write-Error "Failed to delete user: $_"
    }
    #>
}

# Step 3: Property Management Tests
Write-Header "PROPERTY MANAGEMENT"

# Get All Properties
Write-Host "Getting all properties..."
try {
    $propertiesResponse = Invoke-RestMethod -Uri "$apiUrl/properties" -Method Get
    
    if ($propertiesResponse) {
        # Handle different response formats
        $properties = $propertiesResponse
        if ($propertiesResponse.PSObject.Properties.Name -contains "properties") {
            $properties = $propertiesResponse.properties
        }
        
        Write-Success "Found $($properties.Count) properties"
        
        # Get first property ID for later tests
        if ($properties.Count -gt 0) {
            $propertyId = $properties[0]._id
            Write-Host "Using property ID: $propertyId for tests"
        }
    } else {
        Write-Error "No properties found or response format unexpected"
    }
} catch {
    Write-Error "Failed to get properties: $_"
}

# Get Property By ID
if ($propertyId) {
    Write-Host "Getting property by ID: $propertyId..."
    try {
        $propertyDetail = Invoke-RestMethod -Uri "$apiUrl/properties/$propertyId" -Method Get
        
        # Handle different property naming (title or name)
        $propertyName = if ($propertyDetail.title) { $propertyDetail.title } else { $propertyDetail.name }
        Write-Success "Retrieved property: $propertyName"
    } catch {
        Write-Error "Failed to get property details: $_"
    }
    
    # Uncomment to test property deletion
    <#
    Write-Host "Deleting property: $propertyId..."
    try {
        $deleteResponse = Invoke-RestMethod -Uri "$apiUrl/properties/$propertyId" -Method Delete -Headers $headers
        Write-Success "Delete property response: $($deleteResponse | ConvertTo-Json -Compress)"
    } catch {
        Write-Error "Failed to delete property: $_"
    }
    #>
}

# Step 4: Booking Management Tests
Write-Header "BOOKING MANAGEMENT"

# Get All Bookings
Write-Host "Getting all bookings..."
try {
    $bookingsResponse = Invoke-RestMethod -Uri "$apiUrl/bookings" -Method Get -Headers $headers
    
    if ($bookingsResponse) {
        Write-Success "Found $($bookingsResponse.Count) bookings"
        
        # Get first booking ID for later tests
        if ($bookingsResponse.Count -gt 0) {
            $bookingId = $bookingsResponse[0]._id
            Write-Host "Using booking ID: $bookingId for tests"
        }
    } else {
        Write-Error "No bookings found or response format unexpected"
    }
} catch {
    Write-Error "Failed to get bookings: $_"
}

# Confirm Booking
if ($bookingId) {
    Write-Host "Confirming booking: $bookingId..."
    $confirmBody = @{
        status = "Confirmed"
    } | ConvertTo-Json
    
    try {
        $confirmResponse = Invoke-RestMethod -Uri "$apiUrl/bookings/$bookingId/status" -Method Put -ContentType "application/json" -Headers $headers -Body $confirmBody
        Write-Success "Booking confirmed with status: $($confirmResponse.status)"
    } catch {
        Write-Error "Failed to confirm booking: $_"
    }
    
    # Cancel Booking
    Write-Host "Cancelling booking: $bookingId..."
    $cancelBody = @{
        status = "Cancelled"
    } | ConvertTo-Json
    
    try {
        $cancelResponse = Invoke-RestMethod -Uri "$apiUrl/bookings/$bookingId/status" -Method Put -ContentType "application/json" -Headers $headers -Body $cancelBody
        Write-Success "Booking cancelled with status: $($cancelResponse.status)"
    } catch {
        Write-Error "Failed to cancel booking: $_"
    }
}

Write-Header "TESTS COMPLETED"
