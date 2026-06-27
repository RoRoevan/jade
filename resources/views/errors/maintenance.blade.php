<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Under Maintenance | Jade</title>
    <!-- Modern Premium Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --color-bg: #022c22; /* Deep emerald */
            --color-card: rgba(6, 78, 59, 0.4); /* Glassmorphism background */
            --color-text: #f0fdf4; /* Off-white green */
            --color-text-muted: #a7f3d0; /* Soft mint */
            --color-accent: #f59e0b; /* Warm amber */
        }
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Outfit', sans-serif;
            background: radial-gradient(circle at center, #064e3b 0%, #022c22 100%);
            color: var(--color-text);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            overflow: hidden;
            position: relative;
        }

        /* Subtle animated background shapes */
        body::before, body::after {
            content: '';
            position: absolute;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: var(--color-accent);
            opacity: 0.03;
            filter: blur(80px);
            z-index: 0;
            animation: float 12s infinite alternate ease-in-out;
        }

        body::before {
            top: 10%;
            left: 15%;
        }

        body::after {
            bottom: 10%;
            right: 15%;
            animation-delay: -6s;
        }
        
        .container {
            max-width: 560px;
            width: 100%;
            text-align: center;
            background: var(--color-card);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(245, 158, 11, 0.15);
            padding: 3.5rem 2.5rem;
            border-radius: 24px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
            z-index: 1;
            position: relative;
            transform: translateY(0);
            transition: all 0.3s ease;
        }

        .container:hover {
            transform: translateY(-5px);
            border-color: rgba(245, 158, 11, 0.3);
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(245, 158, 11, 0.1);
        }
        
        .icon-wrapper {
            margin-bottom: 2rem;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            position: relative;
        }

        .icon-circle {
            width: 80px;
            height: 80px;
            background: rgba(245, 158, 11, 0.1);
            border: 2px solid var(--color-accent);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color-accent);
            font-size: 2.2rem;
            animation: pulse-ring 2s infinite ease-in-out;
        }

        .status-dot {
            position: absolute;
            bottom: 2px;
            right: 2px;
            width: 16px;
            height: 16px;
            background-color: var(--color-accent);
            border: 3px solid #064e3b;
            border-radius: 50%;
            animation: pulse-dot 1.5s infinite ease-in-out;
        }
        
        h1 {
            font-size: 2.2rem;
            font-weight: 800;
            margin-bottom: 1rem;
            letter-spacing: -0.5px;
            background: linear-gradient(135deg, #ffffff 0%, var(--color-text-muted) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        p {
            font-size: 1.1rem;
            line-height: 1.6;
            color: var(--color-text-muted);
            margin-bottom: 2.5rem;
            font-weight: 300;
        }
        
        .button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, var(--color-accent) 0%, #d97706 100%);
            color: #022c22;
            padding: 0.9rem 2.2rem;
            border-radius: 50px;
            font-size: 1rem;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.2s ease-in-out;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
        }
        
        .button:hover {
            transform: scale(1.03);
            box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
            background: linear-gradient(135deg, #fbbf24 0%, var(--color-accent) 100%);
        }

        .footer {
            margin-top: 3rem;
            font-size: 0.85rem;
            color: rgba(167, 243, 208, 0.4);
            font-weight: 300;
            letter-spacing: 1px;
        }

        @keyframes float {
            0% { transform: translateY(0) scale(1); }
            100% { transform: translateY(-20px) scale(1.05); }
        }

        @keyframes pulse-ring {
            0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
            70% { box-shadow: 0 0 0 15px rgba(245, 158, 11, 0); }
            100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
        }

        @keyframes pulse-dot {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon-wrapper">
            <div class="icon-circle">
                🌱
            </div>
            <div class="status-dot"></div>
        </div>
        <h1>Undergoing Maintenance</h1>
        <p>Sorry, we are undergoing maintenance right now. We are currently updating our systems to serve you better. Please check back shortly!</p>
        <button class="button" onclick="window.location.reload();">Retry Connection</button>
        <div class="footer">JADE &copy; {{ date('Y') }}</div>
    </div>
</body>
</html>
