package com.example.easycartv11

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Button
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import com.example.easycartv11.ui.theme.EasyCartV11Theme
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            EasyCartV11Theme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    RowWithButtonAndText(modifier = Modifier.padding(innerPadding))
                }
            }
        }
    }
}

@Composable
fun RowWithButtonAndText(modifier: Modifier = Modifier) {
    // Utilise une `Row` pour placer les éléments côte à côte
    Column (
        modifier = modifier
            .fillMaxWidth()
            .padding(0.dp), // Marge autour de la ligne
        verticalArrangement = Arrangement.SpaceBetween // Espacement entre les éléments
    ) {
        for(i in 0..3){
            Row(
                modifier = modifier
                    .fillMaxWidth()
                    .padding(0.dp), // Marge autour de la ligne
                horizontalArrangement = Arrangement.End
            ) {
                var text by remember { mutableStateOf("Hello Android!") }
                var count by remember { mutableStateOf(0) }
                Text(
                    text = "Texte : $count",
                    modifier = Modifier.padding(end = 16.dp) // Espacement entre le texte et le bouton
                )
                    Image(
                        painter = painterResource(id = R.drawable.stone),
                        contentDescription = "Icone bouton",
                        modifier = Modifier.size(64.dp).clickable {  count++  }
                    )
                }

            }
        }


}

@Preview(showBackground = true)
@Composable
fun RowWithButtonAndTextPreview() {
    EasyCartV11Theme {
        RowWithButtonAndText()
    }
}
