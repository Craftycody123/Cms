import logging
from sqlalchemy.orm import Session
from app.core.security import hash_password
from app.core.config import settings
from app.models.user import User
from app.models.service import Service, ServiceCategory
from app.models.portfolio import Portfolio
from app.models.team import Team
from app.models.site_setting import SiteSetting

logger = logging.getLogger(__name__)

def init_db(db: Session):
    admin = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
    if not admin:
        if not settings.ADMIN_PASSWORD:
            logger.warning(f"ADMIN_PASSWORD not set in .env. Skipping admin user creation. Set ADMIN_PASSWORD to enable.")
        else:
            admin = User(
                email=settings.ADMIN_EMAIL,
                hashed_password=hash_password(settings.ADMIN_PASSWORD),
                is_admin=True
            )
            db.add(admin)
            db.commit()
            logger.info(f"Admin user created: {settings.ADMIN_EMAIL}")

    if db.query(Service).count() == 0:
        services = [
            Service(title="Outdoor Advertising", category=ServiceCategory.outdoor, description="High-impact outdoor campaigns.", icon_url=""),
            Service(title="Graphic Design", category=ServiceCategory.design, description="Stunning visual designs.", icon_url=""),
            Service(title="Creative Strategy", category=ServiceCategory.creative, description="Innovative creative solutions.", icon_url=""),
            Service(title="Digital Marketing", category=ServiceCategory.marketing, description="Data-driven marketing.", icon_url=""),
            Service(title="Event Management", category=ServiceCategory.events, description="Memorable brand events.", icon_url=""),
            Service(title="Additional Services", category=ServiceCategory.additional, description="Custom tailored solutions.", icon_url=""),
        ]
        db.add_all(services)
        db.commit()

    if db.query(Portfolio).count() == 0:
        portfolios = [
            Portfolio(title="Project Alpha", category="design", description="Brand identity refresh.", client_placeholder="Tech Corp"),
            Portfolio(title="Project Beta", category="marketing", description="Global campaign setup.", client_placeholder="Global Bank"),
            Portfolio(title="Project Gamma", category="outdoor", description="Billboards across the city.", client_placeholder="Retail Inc"),
        ]
        db.add_all(portfolios)
        db.commit()

    if db.query(Team).count() == 0:
        team = [
            Team(name="Jane Doe", role="Creative Director", bio="10 years of experience."),
            Team(name="John Smith", role="Lead Designer", bio="Award-winning visual artist."),
        ]
        db.add_all(team)
        db.commit()

    if db.query(SiteSetting).count() == 0:
        settings = [
            SiteSetting(key="hero_headline", value="Welcome to Alpha Agency"),
            SiteSetting(key="hero_subtext", value="We build brands that stand out in the modern world."),
            SiteSetting(key="about_teaser", value="Alpha is a leading creative agency dedicated to your success."),
            SiteSetting(key="contact_email", value="hello@alpha.com"),
        ]
        db.add_all(settings)
        db.commit()
