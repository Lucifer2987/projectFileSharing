from app.controllers.auth_controller import auth_controller
from app.controllers.file_controller import file_controller
from app.controllers.predict_controller import predict_controller

def setup_routes(app):
    """
    Registers all the routes (blueprints) in the Flask app.

    :param app: Flask app instance
    """
    # Register blueprints
    app.register_blueprint(auth_controller)
    app.register_blueprint(file_controller)
    app.register_blueprint(predict_controller)

    # Health check endpoint
    @app.route('/health')
    def health_check():
        return {'status': 'healthy'}, 200
