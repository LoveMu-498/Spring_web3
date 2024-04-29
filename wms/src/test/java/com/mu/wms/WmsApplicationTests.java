package com.mu.wms;

import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;
import java.sql.SQLException;

@SpringBootTest
class WmsApplicationTests {

	@Resource
	DataSource dataSource;

	@Test
	void contextLoads() {
	}
	@Test
	void contextLoadsOne() throws SQLException {
		System.out.println(dataSource.getConnection());
	}

}
