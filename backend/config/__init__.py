import pymysql

pymysql.version_info = (2, 2, 1, "final", 0) # Manually set version to bypass check
pymysql.install_as_MySQLdb()