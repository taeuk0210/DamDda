# run.py

from damdda_generative_ai import create_app

# Create the Flask application instance
app = create_app()

if __name__ == '__main__':
    # Run the Flask application on all available network interfaces at port 5000
    app.run(host="0.0.0.0", port=5000)
